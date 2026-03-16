#!/usr/bin/env python3
"""
Task 3.2: Train Improved LSTM Model with Hyperparameter Tuning
"""
import warnings
warnings.filterwarnings("ignore")

from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import f1_score, accuracy_score, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)
tf.random.set_seed(RANDOM_STATE)

BASE_DIR = Path.cwd()
DATA_PATH = BASE_DIR / "water_dissegration_data.csv"

print("="*60)
print("TASK 3.2: Improved LSTM Model Training")
print("="*60)

# ===== LOAD DATA =====
print("\n[1] Loading and preprocessing data...")
if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

training_df = pd.read_csv(DATA_PATH)
if "source_file" not in training_df.columns:
    training_df["source_file"] = DATA_PATH.name

label_map = {
    "no activity": "no_activity",
    "no-activity": "no_activity",
    "washing machine": "washing_machine",
    "washing-machine": "washing_machine",
}

training_df["label"] = training_df["label"].astype(str).str.strip().str.lower().replace(label_map)
training_df["Timestamp"] = pd.to_datetime(training_df["Timestamp"], errors="coerce")

required_cols = ["Timestamp", "distance", "label", "source_file"]
training_df = training_df.dropna(subset=required_cols).copy()
training_df = training_df.sort_values(["source_file", "Timestamp"]).reset_index(drop=True)

print(f"✓ Loaded {len(training_df)} samples")

# ===== SIGNAL PREPROCESSING =====
print("\n[2] Preprocessing signals...")
def mode_or_nan(series):
    m = series.mode(dropna=True)
    return m.iloc[0] if len(m) > 0 else np.nan

def simple_outlier_correction(signal, z_thresh=3.0, window=50):
    signal = signal.astype(float).interpolate().bfill().ffill()
    rolling_median = signal.rolling(window=window, center=True, min_periods=1).median()
    rolling_mad = (signal - rolling_median).abs().rolling(window=window, center=True, min_periods=1).median()
    rolling_mad = rolling_mad.replace(0, rolling_mad.mean())
    modified_z = 0.6745 * (signal - rolling_median) / rolling_mad
    outliers = np.abs(modified_z) > z_thresh
    corrected = signal.copy()
    corrected[outliers] = rolling_median[outliers]
    return corrected

def preprocess_per_file(df, resample_rule="10s", lowpass_window=3, outlier_window=50):
    processed = []
    for source_name, grp in df.groupby("source_file"):
        g = grp.sort_values("Timestamp").copy().set_index("Timestamp")
        r = g.resample(resample_rule).agg({"distance": "mean", "label": mode_or_nan})
        r["distance"] = r["distance"].interpolate().bfill().ffill()
        r["label"] = r["label"].ffill().bfill()
        r["distance_clean"] = simple_outlier_correction(r["distance"], window=outlier_window)
        r["distance_lp"] = r["distance_clean"].rolling(window=lowpass_window, center=True, min_periods=1).mean()
        r["slope"] = r["distance_lp"].diff().fillna(0.0)
        r["source_file"] = source_name
        processed.append(r.reset_index())
    final = pd.concat(processed, ignore_index=True)
    final = final.dropna(subset=["distance_lp", "slope", "label"]).reset_index(drop=True)
    return final

proc_df = preprocess_per_file(training_df, resample_rule="10s", lowpass_window=3, outlier_window=50)
print(f"✓ Preprocessed to {len(proc_df)} samples")

# ===== FEATURE ENGINEERING =====
print("\n[3] Creating window features...")
WINDOW_SIZE = 30
STEP_SIZE = 10

X_list = []
y_list = []

for source_name, grp in proc_df.groupby("source_file"):
    grp_sorted = grp.sort_values("Timestamp").reset_index(drop=True)
    for i in range(0, len(grp_sorted) - WINDOW_SIZE, STEP_SIZE):
        window = grp_sorted.iloc[i:i+WINDOW_SIZE]
        X_list.append(np.array([window["distance_lp"].values, window["slope"].values]).T)
        label = window["label"].iloc[-1]
        y_list.append(label)

X = np.array(X_list)
y = np.array(y_list)

print(f"✓ Created {len(X)} windows of size {WINDOW_SIZE}")
print(f"  Shape: {X.shape}")

# ===== TRAIN/TEST SPLIT =====
print("\n[4] Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y)
X_train_seq, X_val, y_train_seq, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=RANDOM_STATE, stratify=y_train)

label_encoder = LabelEncoder()
y_train_enc = label_encoder.fit_transform(y_train)
y_test_enc = label_encoder.transform(y_test)
y_val_enc = label_encoder.transform(y_val)

y_train_cat = to_categorical(y_train_enc)
y_test_cat = to_categorical(y_test_enc)
y_val_cat = to_categorical(y_val_enc)

print(f"✓ Train: {len(X_train_seq)}, Val: {len(X_val)}, Test: {len(X_test)}")
print(f"  Classes: {label_encoder.classes_}")

# ===== BUILD IMPROVED LSTM MODEL =====
print("\n[5] Building IMPROVED LSTM Model...")
print("Architecture:")
print("  - LSTM(128, return_sequences=True)")
print("  - Dropout(0.3)")
print("  - LSTM(64, return_sequences=True)")
print("  - Dropout(0.2)")
print("  - LSTM(32)")
print("  - Dropout(0.2)")
print("  - Dense(64, relu)")
print("  - Dense({}, softmax)".format(len(label_encoder.classes_)))

input_shape = (WINDOW_SIZE, 2)
num_classes = len(label_encoder.classes_)

lstm_model = Sequential([
    LSTM(128, return_sequences=True, input_shape=input_shape),
    Dropout(0.3),
    LSTM(64, return_sequences=True),
    Dropout(0.2),
    LSTM(32),
    Dropout(0.2),
    Dense(64, activation="relu"),
    Dense(num_classes, activation="softmax")
])

lstm_model.compile(optimizer=Adam(learning_rate=0.001), loss="categorical_crossentropy", metrics=["accuracy"])
print(f"✓ Model created with {lstm_model.count_params():,} parameters")

# ===== TRAIN MODEL =====
print("\n[6] Training model (max 15 epochs)...")
history = lstm_model.fit(
    X_train_seq, y_train_cat,
    validation_data=(X_val, y_val_cat),
    epochs=15,
    batch_size=64,
    callbacks=[EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)],
    verbose=1
)

# ===== EVALUATE MODEL =====
print("\n[7] Evaluating model...")
train_loss, train_acc = lstm_model.evaluate(X_train_seq, y_train_cat, verbose=0)
val_loss, val_acc = lstm_model.evaluate(X_val, y_val_cat, verbose=0)
test_loss, test_acc = lstm_model.evaluate(X_test, y_test_cat, verbose=0)

y_pred_prob = lstm_model.predict(X_test, verbose=0)
y_pred = np.argmax(y_pred_prob, axis=1)
f1 = f1_score(y_test_enc, y_pred, average="macro")

print("\n" + "="*60)
print("IMPROVED LSTM MODEL RESULTS")
print("="*60)
print(f"Train Accuracy: {train_acc*100:.2f}%")
print(f"Val Accuracy:   {val_acc*100:.2f}%")
print(f"Test Accuracy:  {test_acc*100:.2f}%")
print(f"F1 Score:       {f1:.4f}")
print("="*60)

# ===== SAVE MODEL =====
print("\n[8] Saving improved model...")
lstm_model.save("saved_models/LSTM_model_improved.h5")
print("✓ Model saved to: saved_models/LSTM_model_improved.h5")

# ===== SAVE PLOTS =====
print("\n[9] Generating training history plots...")
fig, axes = plt.subplots(1, 2, figsize=(14, 4))

axes[0].plot(history.history['accuracy'], label='Train Accuracy')
axes[0].plot(history.history['val_accuracy'], label='Val Accuracy')
axes[0].set_title('Improved LSTM - Accuracy Over Epochs')
axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Accuracy')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].plot(history.history['loss'], label='Train Loss')
axes[1].plot(history.history['val_loss'], label='Val Loss')
axes[1].set_title('Improved LSTM - Loss Over Epochs')
axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('Loss')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("images/improved_lstm_training_history.png", dpi=100, bbox_inches='tight')
print("✓ Plot saved to: images/improved_lstm_training_history.png")

print("\n✅ Task 3.2 Complete!")
print("\nKey Improvements:")
print("  1. Increased LSTM units: 48→128 (first), 24→64 (second), +32 (third)")
print("  2. Added third LSTM layer for deeper learning")
print("  3. Increased dropout rates for regularization")
print("  4. Added intermediate dense layer with 64 units")
print("  5. Increased epochs to 15 with early stopping")
print("  6. Reduced batch size to 64 for better gradient updates")

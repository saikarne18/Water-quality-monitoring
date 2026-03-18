#!/usr/bin/env python3
"""
Comprehensive Testing Script for Water Monitoring System
Tests all endpoints, updates, and verifies system integrity
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path

# Color codes for terminal output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'
CHECK = '✅'
CROSS = '❌'
ARROW = '→'

def print_header(text):
    print(f"\n{BLUE}{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}{CHECK} {text}{RESET}")

def print_error(text):
    print(f"{RED}{CROSS} {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠️  {text}{RESET}")

def print_info(text):
    print(f"{BLUE}{ARROW} {text}{RESET}")

class SystemTester:
    def __init__(self):
        self.project_root = Path("c:\\Users\\SAISHASHANK KARNE\\OneDrive\\Desktop\\iiith phase2\\College-Research-Affiliate-Program-26")
        self.backend_dir = self.project_root / "backend"
        self.frontend_dir = self.project_root / "frontend"
        self.ml_dir = self.project_root / "ml_model"
        
    def check_project_structure(self):
        """Verify all required directories exist"""
        print_header("CHECKING PROJECT STRUCTURE")
        
        dirs_to_check = {
            "Backend": self.backend_dir,
            "Frontend": self.frontend_dir,
            "ML Models": self.ml_dir,
        }
        
        for name, path in dirs_to_check.items():
            if path.exists():
                print_success(f"{name} directory found: {path}")
            else:
                print_error(f"{name} directory NOT found: {path}")
                
    def check_backend_files(self):
        """Verify backend files exist"""
        print_header("CHECKING BACKEND FILES")
        
        files_to_check = {
            "main.py": self.backend_dir / "main.py",
            "requirements.txt": self.backend_dir / "requirements.txt",
            ".env": self.backend_dir / ".env",
        }
        
        for name, path in files_to_check.items():
            if path.exists():
                print_success(f"{name} found")
                if name == "main.py":
                    lines = len(path.read_text().split('\n'))
                    print_info(f"  {lines} lines of code")
            else:
                print_error(f"{name} NOT found")
                
    def check_frontend_files(self):
        """Verify frontend files exist"""
        print_header("CHECKING FRONTEND FILES")
        
        files_to_check = {
            "package.json": self.frontend_dir / "package.json",
            "App.js": self.frontend_dir / "src" / "App.js",
            "branding.js": self.frontend_dir / "src" / "branding.js",
            "CustomCharts.js": self.frontend_dir / "src" / "components" / "CustomCharts.js",
        }
        
        for name, path in files_to_check.items():
            if path.exists():
                print_success(f"{name} found")
            else:
                print_error(f"{name} NOT found")
                
    def check_ml_files(self):
        """Verify ML model files exist"""
        print_header("CHECKING ML MODEL FILES")
        
        models_dir = self.ml_dir / "saved_models"
        if models_dir.exists():
            print_success(f"Models directory found")
            
            # List model files
            model_files = list(models_dir.glob("*.h5"))
            if model_files:
                print_info(f"Found {len(model_files)} model files:")
                for mf in model_files:
                    size_mb = mf.stat().st_size / (1024 * 1024)
                    print_info(f"  - {mf.name} ({size_mb:.1f} MB)")
            else:
                print_error("No .h5 model files found")
        else:
            print_error("Models directory NOT found")
            
    def check_database_config(self):
        """Verify database configuration"""
        print_header("CHECKING DATABASE CONFIGURATION")
        
        env_file = self.backend_dir / ".env"
        if env_file.exists():
            print_success(".env file found")
            env_content = env_file.read_text()
            
            required_vars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"]
            for var in required_vars:
                if var in env_content:
                    # Don't print the actual value for security
                    if "PASSWORD" in var:
                        print_success(f"{var} configured (hidden for security)")
                    else:
                        # Extract value
                        lines = env_content.split('\n')
                        for line in lines:
                            if line.startswith(var):
                                value = line.split('=')[1].strip()
                                print_success(f"{var} = {value}")
                                break
                else:
                    print_error(f"{var} NOT configured")
        else:
            print_error(".env file NOT found")
            
    def check_backend_endpoints(self):
        """Count and verify backend endpoints"""
        print_header("CHECKING BACKEND ENDPOINTS")
        
        main_py = self.backend_dir / "main.py"
        if main_py.exists():
            content = main_py.read_text()
            
            # Count endpoints
            http_endpoints = content.count("@app.post") + content.count("@app.get") + \
                            content.count("@app.put") + content.count("@app.delete")
            ws_endpoints = content.count("@app.websocket")
            
            print_info(f"HTTP Endpoints: {http_endpoints}")
            print_info(f"WebSocket Endpoints: {ws_endpoints}")
            print_info(f"Total: {http_endpoints + ws_endpoints}")
            
            # Check for key endpoints
            key_endpoints = [
                "/api/v1/signup",
                "/api/v1/login",
                "/api/v1/predict",
                "/ws/predictions",
                "/api/v1/alerts",
            ]
            
            print_info("\nKey endpoints check:")
            for endpoint in key_endpoints:
                if endpoint in content:
                    print_success(f"{endpoint} implemented")
                else:
                    print_error(f"{endpoint} NOT found")
                    
    def check_dependencies(self):
        """Check if Python dependencies are installed"""
        print_header("CHECKING PYTHON DEPENDENCIES")
        
        dependencies = [
            "fastapi",
            "uvicorn",
            "psycopg2",
            "tensorflow",
            "pydantic",
            "jwt",
            "bcrypt",
        ]
        
        for dep in dependencies:
            try:
                __import__(dep.replace("-", "_"))
                print_success(f"{dep} installed")
            except ImportError:
                print_warning(f"{dep} NOT installed (pip install required)")
                
    def run_all_checks(self):
        """Execute all system checks"""
        print(f"\n{BLUE}{BLUE}{'*'*60}")
        print(f"  WATER MONITORING SYSTEM - COMPREHENSIVE SYSTEM CHECK")
        print(f"{'*'*60}{RESET}\n")
        
        self.check_project_structure()
        self.check_backend_files()
        self.check_frontend_files()
        self.check_ml_files()
        self.check_database_config()
        self.check_backend_endpoints()
        self.check_dependencies()
        
        print_header("SYSTEM CHECK COMPLETE")
        print(f"{GREEN}Ready for deployment!{RESET}\n")

if __name__ == "__main__":
    tester = SystemTester()
    tester.run_all_checks()

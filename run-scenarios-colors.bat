@echo off
echo Running Scenarios.jsx color replacement script...
python replace_scenarios_colors.py
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Replacement completed successfully!
) else (
    echo.
    echo An error occurred during replacement.
)

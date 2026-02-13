@echo off
echo Running color replacement script...
python replace-colors.py
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Replacement completed successfully!
) else (
    echo.
    echo An error occurred during replacement.
)

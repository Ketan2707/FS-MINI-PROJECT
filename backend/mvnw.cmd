@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "MAVEN_HOME=%SCRIPT_DIR%.mvn\maven\apache-maven-3.9.6"
set "MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if not exist "%MVN_CMD%" (
  echo Maven binary not found at "%MVN_CMD%".
  exit /b 1
)

set "PREFERRED_JAVA_HOME="
for %%V in (21 22 23 24 25) do (
  if not defined PREFERRED_JAVA_HOME (
    for /d %%D in ("%ProgramFiles%\Eclipse Adoptium\jdk-%%V*") do (
      if exist "%%~fD\bin\java.exe" set "PREFERRED_JAVA_HOME=%%~fD"
    )
  )
  if not defined PREFERRED_JAVA_HOME (
    for /d %%D in ("%ProgramFiles%\Java\jdk-%%V*") do (
      if exist "%%~fD\bin\java.exe" set "PREFERRED_JAVA_HOME=%%~fD"
    )
  )
  if not defined PREFERRED_JAVA_HOME (
    for /d %%D in ("%ProgramFiles%\Microsoft\jdk-%%V*") do (
      if exist "%%~fD\bin\java.exe" set "PREFERRED_JAVA_HOME=%%~fD"
    )
  )
)

if defined PREFERRED_JAVA_HOME (
  set "JAVA_HOME=%PREFERRED_JAVA_HOME%"
)

set "PATH_JAVA_EXE="
if not defined JAVA_HOME (
  for /f "delims=" %%I in ('where java 2^>nul') do (
    set "PATH_JAVA_EXE=%%I"
    goto :found_java
  )
)

:found_java
if not defined JAVA_HOME if defined PATH_JAVA_EXE (
  for %%I in ("!PATH_JAVA_EXE!") do set "JAVA_HOME=%%~dpI.."
)

call "%MVN_CMD%" %*
exit /b %ERRORLEVEL%

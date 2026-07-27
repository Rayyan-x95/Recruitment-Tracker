@ECHO OFF
@SETLOCAL

SET MAVEN_JAVA_EXE="C:\Program Files\Java\jdk-21.0.12\bin\java.exe"
IF NOT EXIST %MAVEN_JAVA_EXE% (
    SET MAVEN_JAVA_EXE="java.exe"
)

%MAVEN_JAVA_EXE% -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" "-Dmaven.home=%~dp0.mvn\wrapper" "-Dmaven.multiModuleProjectDirectory=%~dp0." org.apache.maven.wrapper.MavenWrapperMain %*

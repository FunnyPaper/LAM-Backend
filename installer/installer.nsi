!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "StrFunc.nsh"

# Configuration

Name "LAM Backend Application"
OutFile "lam-backend-installer.exe"
RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\LAM Backend"
InstallDirRegKey HKCU "Software\LAM Backend" "Install_Dir"
ShowInstDetails show
ShowUninstDetails show

# Pages

Page directory
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

# Registry entries

Section
	SectionIn 1

	# Create installation directory
	CreateDirectory $INSTDIR

	# Install files
	SetOutPath $INSTDIR
    File /r "${__DIR__}\..\..\build\*"

	# Desktop shortcut
	CreateShortcut "$DESKTOP\LAM Backend.lnk" "$INSTDIR\lam-backend.exe" "" "$INSTDIR\lam-backend.exe" 0 SW_SHOWNORMAL "" "LAM Backend Application"

	# Start menu shortcut
	CreateDirectory "$SMPROGRAMS\LAM Backend"
	CreateShortcut "$SMPROGRAMS\LAM Backend\LAM Backend.lnk" "$INSTDIR\lam-backend.exe" "" "$INSTDIR\lam-backend.exe" 0 SW_SHOWNORMAL "" "LAM Backend Application"
	CreateShortcut "$SMPROGRAMS\LAM Backend\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0 SW_SHOWNORMAL "" "Uninstall LAM Backend Application"

	# Registry information
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LAM Backend" "InstallLocation" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LAM Backend" "DisplayName" "LAM Backend Application"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LAM Backend" "DisplayVersion" "0.3.0"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LAM Backend" "Publisher" "FunnyPaper"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\LAM Backend" "UninstallString" "$INSTDIR\uninstall.exe"

	# Uninstaller
	WriteUninstaller "$INSTDIR\uninstall.exe"

SectionEnd

# Uninstaller Section

Section "Uninstall"
	# Remove files
	RMDir /r "$INSTDIR"
	RMDir "$INSTDIR"

	# Desktop shortcut
	Delete "$DESKTOP\LAM Backend.lnk"

	# Start menu shortcuts
	RMDir "$SMPROGRAMS\LAM Backend"

	# Registry information
	DeleteRegKey HKLM "Software\LAM Backend"

SectionEnd

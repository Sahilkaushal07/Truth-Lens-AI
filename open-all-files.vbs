Option Explicit

Dim shell, fso, root, cmd, folder
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

root = "C:\Users\sahil\OneDrive\Desktop\TRUTHLENSAI"

If fso.FolderExists(root) = False Then
  WScript.Echo "Root folder not found: " & root
  WScript.Quit 1
End If

' Try to open VSCode with a workspace; then open files via --reuse-window
cmd = ""
cmd = cmd & """" & "C:\\Users\\sahil\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe""" & " --reuse-window"

' If Code.exe isn't at that path, fall back to simply using 'code'
Dim codePath
codePath = "C:\Users\sahil\AppData\Local\Programs\Microsoft VS Code\Code.exe"
If fso.FileExists(codePath) Then
  cmd = """" & codePath & """ & " --reuse-window"
Else
  cmd = "code --reuse-window"
End If

' Collect up to N files to avoid VSCode overload
Dim maxFiles, count
maxFiles = 250
count = 0

Dim ts, file
Set ts = Nothing

' Write a temp file list to pass to VSCode via a response file style (not supported)
' We'll open in batches.
Dim batch, batchSize
batchSize = 25
batch = ""

Dim stack, fld
Set stack = CreateObject("System.Collections.Stack")
stack.Push root

Do While stack.Count > 0
  Set fld = fso.GetFolder(CStr(stack.Pop()))

  Dim fil
  For Each fil In fld.Files
    If count >= maxFiles Then Exit Do
    If LCase(fso.GetExtensionName(fil.Path)) <> "" Then
      ' open typical text/code files
      Dim ext
      ext = LCase(fso.GetExtensionName(fil.Path))
      If ext = "js" Or ext = "jsx" Or ext = "ts" Or ext = "tsx" Or ext = "css" Or ext = "html" Or ext = "json" Or ext = "md" Or ext = "yml" Or ext = "yaml" Or ext = "py" Or ext = "txt" Or ext = "sh" Or ext = "ps1" Or ext = "dockerfile" Or ext = "env" Then
        batch = batch & " """ & fil.Path & """
        count = count + 1

        If (count Mod batchSize) = 0 Then
          shell.Run cmd & batch, 1, False
          batch = ""
        End If
      End If
    End If
  Next

  Dim subfld
  For Each subfld In fld.SubFolders
    stack.Push subfld.Path
  Next
Loop

If Len(batch) > 0 Then
  shell.Run cmd & batch, 1, False
End If

WScript.Echo "Queued VSCode to open up to " & count & " files (text/code extensions)."

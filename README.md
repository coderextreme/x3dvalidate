# x3dvalidate
Validate JSON files (.x3dj or .json) against X3D JSON schema version 4.0 with Ajv

Node.js is a requirement: Download from https://nodejs.org/

First install node.js and git. Download and install node.js from https://nodejs.org/.  Download and install git is available at https://git-scm.com/

```bash
git clone https://github.com/coderextreme/x3dvalidate
cd x3dvalidate
npm install -g x3dvalidate
node x3dvalidate.js examples/*.json    # use your own .x3dj or .json files (any extension works)
node test/app.js # simple test app
```
x3dvalidate is a full npx program (an npm module), thus you can run:

```bash
npx x3dvalidate file1.json file2.json ...
# NOTE:  I've had good luck specifying the full path to the JSON file(s)
```

For folders, I recommend using find and xargs on Linux/MacOS/Git for Windows/Git Bash/WSL

Example:
```bash
find ./examples -type f -name "*.json" -print0 | xargs -0 npx x3dvalidate
```

On Windows 10 (11?),
=====================================================================================================================

On windows PowerShell, you will need to set your Execution-Policy. Research PowerShell execution policies for the best policies.  The first command below lists your policies and scope. <Fill in website to research execution polices>. You will get a message with the website to go to if the powershell scripts fail.   I recommend setting the policies back to the previous level when complete. Get old policy and scope from output of first command


```ps1
PS C:\Users\yottzumm\x3dvalidate> Get-ExecutionPolicy -List
PS C:\Users\yottzumm\x3dvalidate> Set-ExecutionPolicy <policy> -Scope CurrentUser
PS C:\Users\yottzumm\x3dvalidate> .\bin\x3dvalidate.ps1 examples\abox.json .\examples\ball.json
PS C:\Users\yottzumm\x3dvalidate> Set-ExecutionPolicy <old policy> -Scope CurrentUser
PS C:\Users\yottzumm\x3dvalidate> Get-ExecutionPolicy -List
```

On the whole, it might be easier to run the Command Prompt.

```cmd
C:\Users\yottzumm\x3dvalidate>bin\x3dvalidate.cmd examples\abox.json examples\ball.json
```

=====================================================================================================================
For MacOS, install node.js, homebrew and git.  Before running the commands above in Terminal, download an install homebrew from https://brew.sh/, and then invoke:

```zsh
$ brew install git
```

in Terminal.  Or git should be available in developer command tools from Apple. I was able to run node.js after installign the MacOS package from https://nodejs.org.  Homebrew requires your password to install.


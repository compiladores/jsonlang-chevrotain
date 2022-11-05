# ---------------------------------- deno .vscode ------------------------------------

define LAUNCH_JSON
{
    "configurations": [
        {
            "name": "Current file",
            "request": "launch",
            "program":"${file}",
            "cwd":"${workspaceFolder}",
            "runtimeExecutable": "${workspaceFolder}/deno",
            "runtimeArgs": ["run", "--inspect-brk=127.0.0.1:9229","-A"],
            "attachSimplePort": 9229,
            "type": "node"
        },{
            "name": "Launch tests",
            "request": "launch",
            "program":"${file}",
            "cwd":"${workspaceFolder}",
            "runtimeExecutable": "${workspaceFolder}/deno",
            "runtimeArgs": ["test", "--inspect-brk=127.0.0.1:9229","-A"],
            "attachSimplePort": 9229,
            "type": "node"
        }
    ]
}
endef
export LAUNCH_JSON

.vscode/launch.json: .vscode
	echo "$$LAUNCH_JSON" > .vscode/launch.json

define SETTINGS_JSON
{
  "deno.path": "./deno",
  "deno.enable": true,
  "files.eol": "\\n"
}
endef
export SETTINGS_JSON

.vscode/settings.json: .vscode
	echo "$$SETTINGS_JSON" > .vscode/settings.json

define EXTENSIONS_JSON
{
    "recommendations": ["denoland.vscode-deno"]
}
endef
export EXTENSIONS_JSON

.vscode/extensions.json: .vscode
	echo "$$EXTENSIONS_JSON" > .vscode/extensions.json

.vscode:
	mkdir .vscode

vscode: .vscode/extensions.json .vscode/settings.json .vscode/launch.json

deno:
	curl -fsSL https://deno.land/install.sh | DENO_INSTALL=./d sh -s "v1.26.0"
	mv ./d/bin/deno ./deno
	rm -rf ./d

setup: deno .vscode .vscode/settings.json .vscode/launch.json .vscode/extensions.json
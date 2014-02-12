# Developer Guide

The following instructions will automatically download and provision a virtual machine for you


### Getting Started

1. Install Git: http://git-scm.com/downloads (or [Github for Windows](http://windows.github.com/) if you want a GUI)
2. Install VirtualBox: https://www.virtualbox.org/wiki/Downloads
3. Install Vagrant: http://www.vagrantup.com
4. Open a terminal
5. Clone the project: `git clone https://github.com/AndersRasmussen/NGJ2014`
6. Enter the project directory: `cd NGJ2014`
7. Run the nodejs package manager: `npm install`
8. build the project: `grunt`
9. The project is ready to go!

### Executing the application
When the previous step has been completed, it is time to execute the nodejs application, this is done by invoking the desired web-application, e.g. the PoC project:
```
node build/server/Init.js
```

### Developing and debugging
 A developer could benefit from the following:

1. grunt should be started in watch mode to automatically detect changes in the src-folder: `grunt watch`
2. The nodejs server should be started to automatically detect and reboot on changes in the build-folder, e.g. like this: `node build/server/Devinit.js`
3. Unit tests are executed by: `grunt test`

### Using Vagrant

When you're ready to start working, boot the VM:
```
vagrant up
```

(The first time you do this, it will take a while as it downloads the VM image and installs it. Go grab a coffee.)

Once the machine has booted up, you can shell into it by typing:
```
vagrant ssh
```

The application are available on http://localhost:8000. Vagrant creates port forwarding for the machine to your local machine.

**Note to Windows users**: You cannot run ```vagrant ssh``` from a cmd prompt. Use _Git Shell_ which are installed with Github for Windows.

The code is found in the /vagrant directory in the image.


### Shutting down the VM

When you're done working, you can shut down Vagrant with:

```
vagrant halt
```
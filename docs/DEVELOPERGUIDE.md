# Developer Guide

The following instructions will automatically download and provision a virtual machine for you


### Getting Started

1. Install Git: http://git-scm.com/downloads (or [Github for Windows](http://windows.github.com/) if you want a GUI)
2. Install VirtualBox: https://www.virtualbox.org/wiki/Downloads
3. Install Vagrant: http://www.vagrantup.com
4. Open a terminal
5. Clone the project: `git clone https://github.com/AndersRasmussen/NGJ2014`
6. Enter the project directory: `cd NGJ2014`


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
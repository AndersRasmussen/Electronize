Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.provision :shell, inline: "sudo apt-get update"
  config.vm.provision :shell, inline: "sudo apt-get install -y build-essential redis-server python-software-properties --no-install-recommends"
  config.vm.provision :shell, inline: "sudo add-apt-repository ppa:chris-lea/node.js"
  config.vm.provision :shell, inline: "sudo apt-get update"
  config.vm.provision :shell, inline: "sudo apt-get install -y nodejs --no-install-recommends"
  config.vm.provision :shell, inline: "sudo npm config set registry http://registry.npmjs.org/"
  config.vm.provision :shell, inline: "sudo npm install supervisor -g"
  config.vm.provision :shell, inline: "sudo npm install /vagrant"
  config.vm.provision :shell, inline: "sudo cp /vagrant/node-server.conf /etc/init/node-server.conf"
  config.vm.provision :shell, inline: "sudo start node-server"  

  config.vm.network :forwarded_port, guest: 8000, host: 8000
end

<?php 

class UserForm extends Form{


	public function build(){
		$this->addFormField('lastname');
		$this->addFormField('firstname');
		$this->addFormField('address');
		$this->addFormField('city');
		$this->addFormField('zipcode');
		$this->addFormField('phone');
		$this->addFormField('email');
	}
}





 ?>
<?php
class RegisterController
{
    public function httpGetMethod()
    {
    	return ['_form' => new UserForm()];
    }
    public function httpPostMethod(Http $http, array $formFields)
    {
    	try{
    		 $birthday = $formFields['year'].'-'.$formFields['month'].'-'.$formFields['day'];
        $model = new UserModel();
        $model->signUp($formFields['lastname'], $formFields['firstname'], $formFields['email'], $formFields['password'], $birthday, $formFields['address'], $formFields['city'], $formFields['zipcode'], $formFields['country'], $formFields['phone']);

        $http->redirectTo('/');
    	}
    	catch(DomainException $exception){
    		$form = new UserForm();
    		$form->bind($formFields);
    		$form->setErrorMessage($exception->getMessage());
    		return ['_form' => $form];
    	};

        
        
       
    }
}
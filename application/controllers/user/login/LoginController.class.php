
<?php
class LoginController
{
    public function httpGetMethod()
    {
    }
    public function httpPostMethod(Http $http, array $formFields)
    {
        $errors = [];
        try
        {
           $model = new UserModel();
        $user = $model->findWithEmailPassword($formFields['email'],$formFields['password']);

        //On crée la session pour l'utilisateur
        $session = new UserSession();
        //Le    premier paramètre   est le  nom du  stockage
        //Le    deuxième    paramètre   est le  contenu
        $session->create($user['Id'],$user['LastName'],$user['FirstName'],$user['Email']);
        $flash = new FlashBag();
        $flash->add("Vous êtes connecté. Bonjour ! ");
        $http->redirectTo('/');
        }

        catch(DomainException $exception){
           $form = new LoginForm();
            $form->bind($formFields);
            $form->setErrorMessage($exception->getMessage());
            return ['_form' => $form];
        };
   
    }
}
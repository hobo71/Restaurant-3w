
<?php
class LogoutController
{
    public function  httpGetMethod(Http $http)
    {
        $session = new UserSession();
        $session->destroy();
        $flash = new FlashBag();
        $flash->add("Vous avez été déconnecté. Au revoir.");
        //var_dump($flash->hasMessages());
        //exit();
        $http->redirectTo('/user/login');
    }
}
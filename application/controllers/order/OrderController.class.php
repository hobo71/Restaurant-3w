<?php
class OrderController
{
    public function httpGetMethod(Http $http, array $queryFields)
    {
        $user = new UserSession();
        if($user->isAuthenticated() == false)
        {
            $http->redirectTo('/');
        }
        /**
         * TODO
         *
         * *************PROCEDURE Requete AJAX affichage produit ***************************
         * A partir de la sélection de l'input select (#productName), retourner une info
         * A partir de cet info, afficher le bon produit (photo description prix)
         * Et changer la quantité max
         *
         */
        /**
         * TODO
         *
         * *************PROCEDURE Stockage dans le panier ***************************
         * Ajouter le nom du produit + la quantité sélectionnés, dans le local storage au format JSON
         * Vérifier que la quantité est un nombre entier
         * Récuperer la liste des produits stockés dans le local storage.
         * A partir de la liste récupérée, faire une query findOne, pour trouver le produit
         * Ajouter le resultat au sein d'un tableau
         * Faire un foreach dans la view pour affiché tous les résultats du tableau dans la table récapitulatif de la commande
         * Créer un bouton permettant de supprimer une ligne du tableau, et donc une ligne du local storage
         * Régler le prix total en fonction de la quantité et du prix unitaire
         * 
         */
        /**
         * TODO
         *
         * *************PROCEDURE transmission du formulaire panier vers la page de validation ******************
         * Régler le second formulaire pour envoyer les données en post vers la page order/validation
         * Vérifier que la quantité demandée correspond à la quantité en stock, et d'un minimum de un.
         *
         */
        $model = new MealModel();
        $products = $model->listAll();
        return [
            'meals'=> $products,
        ];
    }
    public function httpPostMethod(Http $http, array $formFields)
    {
    }
}

'use strict';
var OrderForm = function(){
    this.$form = $('#order-form');
    this.$meal = $('#meal');
    this.$mealDetails = $('#meal-details');
    this.$orderSummary = $('#order-summary');
    this.$validator = $('#validate-order');
    this.basketSession = new BasketSession();
};

OrderForm.prototype.onAjaxChangeMeal = function(meal){
    var imageUrl;
    imageUrl = getWwwUrl()+ '/images/meals/' + meal.Photo;

    this.$mealDetails.children('p').text(meal.Description);
     this.$mealDetails.find('strong').text(formatMoneyAmount(meal.SalePrice));
    this.$mealDetails.children('img').attr('src',imageUrl); 

    this.$form.find('input[name=salePrice]').val(meal.SalePrice);
};

OrderForm.prototype.onChangeMeal = function(){

var mealId;
mealId = this.$meal.val();


$.getJSON( getRequestUrl() + '/meal?id=' + mealId, this.onAjaxChangeMeal.bind(this));
}


OrderForm.prototype.onAjaxRefreshOrderSummary = function(basketViewHtml)

{

    // Insertion du contenu du panier (la vue en PHP) dans le document HTML.

    this.$orderSummary.html(basketViewHtml);





    // Est-ce que le panier est vide ?

    if(this.basketSession.isEmpty() == true)

    {

        // Oui, le bouton de validation de commande est désactivé.

        this.$validator.attr('disabled', true);

    }

    else

    {

        // Non, le bouton de validation de commande est activé.

        this.$validator.attr('disabled', false);

    }

};

OrderForm.prototype.refreshOrderSummary = function()

{

    var formFields;



    /*

     * Préparation d'une requête HTTP POST, construction d'un objet représentant

     * les données de formulaire.

     *

     * Ainsi form.basketItems donnera du côté du serveur en PHP $formFields['basketItems']

     */

    formFields =

    {

        basketItems : this.basketSession.items

    };



    /*

     * Exécution d'une requête HTTP POST AJAH (Asynchronous JavaScript And HTML)

     * pour récupérer le contenu du panier sous la forme d'un document HTML.

     */

    $.post

    (

        getRequestUrl() + '/basket',                // URL de destination

        formFields,                                 // Données HTTP POST

        this.onAjaxRefreshOrderSummary.bind(this)   // Au retour de la réponse HTTP

    );

};

OrderForm.prototype.onClickRemoveBasketItem = function(event)

{

    var $button;

    var mealId;
    /*

     * Récupération de l'objet jQuery représentant le bouton de suppression sur

     * lequel l'utilisateur a cliqué.

     */

    $button = $(event.currentTarget);

    // Récupération du produit alimentaire relié au bouton.

    mealId = $button.data('meal-id');
    // Suppression du produit alimentaire du panier.

    this.basketSession.remove(mealId);

    // Mise à jour du récapitulatif de la commande.

    this.refreshOrderSummary();

    /*

     * Par défaut les navigateurs ont pour comportement d'envoyer le formulaire

     * en requête HTTP à l'URL indiquée dans l'attribut action des balises <form>

     *

     * Il faut donc empêcher le comportement par défaut du navigateur.

     */

    event.preventDefault();

};
OrderForm.prototype.onAjaxClickValidateOrder = function(result)
{
    var orderId;

    // Désérialisation du résulat en JSON contenant le numéro de commande.
    orderId = JSON.parse(result);

    // Redirection HTTP vers la page de demande de paiement de la commande.
    window.location.assign
    (
        getRequestUrl() + '/order/payment?id=' + orderId
    );
};
OrderForm.prototype.onSubmit = function(event){

     /*

     * Le formulaire doit être validé par la classe FormValidator.

     *

     * Quand cette classe s'exécute elle enregistre combien d'erreurs de validation elle

     * a trouvé dans un attribut HTML data-validation-error-count de la balise <form>

     * (voir le code dans la méthode onSubmitForm() de la classe FormValidator).

     *

     * Si au moins une erreur est trouvée on ne veut surtout pas continuer !

     */

    if(this.$form.data('validation-error-count') > 0)

    {

        // On ne fait rien, une ou des erreurs ont été trouvées dans le formulaire.

        return;

    }

    // Ajout de l'article dans le panier.

    this.basketSession.add

    (

        // Valeur sélectionnée dans la liste déroulante des produits alimentaires

        this.$meal.val(),

        // Nom sélectionné dans la liste déroulante des produits alimentaires

        this.$meal.find('option:selected').text(),



        // Saisie de la quantité par l'utilisateur

        this.$form.find('input[name=quantity]').val(),



        // Champ de formulaire caché contenant le prix

        this.$form.find('input[name=salePrice]').val()

    );


    // Mise à jour du récapitulatif de la commande.

    this.refreshOrderSummary();

    /*

     * Réinitialisation de l'ensemble du formulaire à son état de départ,

     * pour permettre une nouvelle saisie de l'utilisateur.

     */

    this.$form.trigger('reset');                    // Réinitialisation du formulaire

    this.$meal.trigger('change');                   // Sélection du premier produit alimentaire

    this.$form.children('.error-message').hide();   // Cache les messages d'erreurs





    /*

     * Par défaut les navigateurs ont pour comportement d'envoyer le formulaire

     * en requête HTTP à l'URL indiquée dans l'attribut action des balises <form>

     *

     * Il faut donc empêcher le comportement par défaut du navigateur.

     */

    event.preventDefault();

};
OrderForm.prototype.onClickValidateOrder = function()
{
    var formFields;

    /*
     * Préparation d'une requête HTTP POST, construction d'un objet représentant
     * les données de formulaire.
     *
     * Ainsi form.basketItems donnera du côté du serveur en PHP $formFields['basketItems']
     */
    formFields =
    {
        basketItems : this.basketSession.items
    };

    /*
     * Exécution d'une requête HTTP POST AJAJ (Asynchronous JavaScript And JSON)
     * pour valider la commande et procéder au paiement.
     */
    $.post
    (
        getRequestUrl() + '/order/validation',      // URL de destination
        formFields,                                 // Données HTTP POST
        this.onAjaxClickValidateOrder.bind(this)    // Au retour de la réponse HTTP
    );
};

OrderForm.prototype.onSubmitForm = function(event)
{
    /*
     * Le formulaire doit être validé par la classe FormValidator.
     *
     * Quand cette classe s'exécute elle enregistre combien d'erreurs de validation elle
     * a trouvé dans un attribut HTML data-validation-error-count de la balise <form>
     * (voir le code dans la méthode onSubmitForm() de la classe FormValidator).
     *
     * Si au moins une erreur est trouvée on ne veut surtout pas continuer !
     */
    if(this.$form.data('validation-error-count') > 0)
    {
        // On ne fait rien, une ou des erreurs ont été trouvées dans le formulaire.
        return;
    }


    // Ajout de l'article dans le panier.
    this.basketSession.add
    (
        // Valeur sélectionnée dans la liste déroulante des produits alimentaires
        this.$meal.val(),

        // Nom sélectionné dans la liste déroulante des produits alimentaires
        this.$meal.find('option:selected').text(),

        // Saisie de la quantité par l'utilisateur
        this.$form.find('input[name=quantity]').val(),

        // Champ de formulaire caché contenant le prix
        this.$form.find('input[name=salePrice]').val()
    );


    // Mise à jour du récapitulatif de la commande.
    this.refreshOrderSummary();


    /*
     * Réinitialisation de l'ensemble du formulaire à son état de départ,
     * pour permettre une nouvelle saisie de l'utilisateur.
     */
    this.$form.trigger('reset');                    // Réinitialisation du formulaire
    this.$meal.trigger('change');                   // Sélection du premier produit alimentaire
    this.$form.children('.error-message').hide();   // Cache les messages d'erreurs


    /*
     * Par défaut les navigateurs ont pour comportement d'envoyer le formulaire
     * en requête HTTP à l'URL indiquée dans l'attribut action des balises <form>
     *
     * Il faut donc empêcher le comportement par défaut du navigateur.
     */
    event.preventDefault();
};


OrderForm.prototype.run = function()
{
    this.$meal.on('change',this.onChangeMeal.bind(this));
    this.$meal.trigger('change');
    this.$orderSummary.on('click','button',this.onClickRemoveBasketItem.bind(this));
    this.$form.find('[type=submit]').on('click',this.onSubmit.bind(this));

     this.$validator.on('click', this.onClickValidateOrder.bind(this));


    // Installation d'un gestionnaire d'évènement sur la soumission du formulaire.
    //this.$form.on('submit', this.onSubmitForm.bind(this));
    

    /*
     * Le formulaire est caché au démarrage (pour éviter le clignotement de la page),
     * il faut l'afficher.
     */
    this.$form.fadeIn('fast');


    // Affichage initial du récapitulatif de la commande.
    this.refreshOrderSummary();
}

var order = new OrderForm();
order.run();

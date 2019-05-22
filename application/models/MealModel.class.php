<?php 

class MealModel
{
    public function listAll()
    {
        $db = new Database();
        $sql = "SELECT * FROM `Meal`";
        return $db->query($sql);
    }

     public function findOne($nameProduct)
    {
        $db = new Database();
        $product = $db->queryOne('SELECT * FROM Meal WHERE Name = ?', [$nameProduct]);
        return $product;
    }
    
    public function find($id)
    {
        $db = new Database();
        $product = $db->queryOne('SELECT * FROM Meal WHERE Id = ?', [$id]);
        return $product;
    }
}



 ?>
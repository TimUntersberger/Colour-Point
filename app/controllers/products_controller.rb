class ProductsController < ApplicationController
  def create
    Categorie.find(params[:category_id]).products.create name: "", format: "", quantity: 0, minquantity: 0
  end
  def update
    Product.find(params[:id]).update_attributes(params[:attribute] => params[:new_value])
  end
  def destroy
    Product.find(params[:id]).destroy
  end
end

class CategoriesController < ApplicationController
  def index
    @categories = Categorie.all
  end
  def show
    @current_category = Categorie.find(params[:id])
  end
  def create
    Categorie.create name: "Platzhalter"
    redirect_to categories_path
  end
  def destroy
    Categorie.find(params[:id]).destroy
    redirect_to categories_path
  end
  def update
    Categorie.find(params[:id]).update_attributes(name: params[:new_value])
  end
end

class AddCategorieToProducts < ActiveRecord::Migration[5.1]
  def change
    add_reference :products, :categorie, foreign_key: true
  end
end

class Categorie < ApplicationRecord
  has_many :products, dependent: :destroy
end

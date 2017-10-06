class UsersController < ApplicationController
  devise :database_authenticatable, :registerable,
       :recoverable, :rememberable, :trackable, :validatable,
       :confirmable, :lockable, :timeoutable, :omniauthable
    
end

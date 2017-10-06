class AddLoggedinToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :loggedin, :string
  end
end

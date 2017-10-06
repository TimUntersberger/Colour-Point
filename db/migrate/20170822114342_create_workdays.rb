class CreateWorkdays < ActiveRecord::Migration[5.1]
  def change
    create_table :workdays do |t|

      t.timestamps
    end
  end
end

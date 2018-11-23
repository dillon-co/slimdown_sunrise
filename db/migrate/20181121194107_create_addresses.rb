class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :first_name
      t.string :laas_name
      t.string :city
      t.string :state
      t.string :country
      t.string :zip_code
      t.string :email_address
      t.string :phone_number

      t.timestamps
    end
  end
end

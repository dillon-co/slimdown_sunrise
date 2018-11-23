Rails.application.routes.draw do
  get 'privacy' => 'pages#privacy', as: :privacy

  get 'terms' =>'pages#terms', as: :terms

  get 'contact' => 'pages#contact', as: :contact

  resources :addresses

  root to: 'addresses#new'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

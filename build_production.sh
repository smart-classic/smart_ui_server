cd ui/static
(./js steal/buildjs smart_ui_server/smart_ui_server.html) & \
(./js steal/buildjs single_app_view/single_app_view.html) & \
(./js steal/buildjs showcase/showcase.html)
wait

cd ../..
sed -i 's/=development/=production/g' templates/ui/index.html templates/ui/showcase.html templates/ui/single_app_view.html

# Mensagem de commit
$commitMessage = "This an automatic commit to save the sqlite archive"

# Adicione todos os arquivos ao staging
git add .

# Crie o commit com a mensagem especificada
git commit -m $commitMessage

# Faça o push para o repositório remoto
git push origin master
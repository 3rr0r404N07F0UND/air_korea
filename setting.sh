pip install virtualenv && virtualenv server && source server/bin/activate

cd server && echo "flask>=2.3.2" > requirements.txt && pip install -r requirements.txt && mkdir template && mkdir static

cd template && mkdir jinja2 && cd ../static && mkdir css js img jsx

touch main_server.py

export FLASK_APP="main_server.py"
export FLASK_ENV="development"

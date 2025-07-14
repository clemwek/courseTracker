pipeline {
    agent any

    stages {
        stage('Frontend Tests') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        ls -la
                        node --version
                        npm --version
                        echo "Installing frontend dependencies..."
                        npm ci
                        echo "Running frontend tests..."
                        npm run test
                    '''
                }
            }
        }

        stage('Backend Tests') {
            agent {
                docker {
                    image 'ruby:3.4.4-alpine'
                    args '-u root'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        ls -la
                        ruby --version
                        bundle --version

                        echo "Installing build dependencies..."
                        apk add --no-cache build-base yaml-dev libffi-dev

                        echo "Installing backend dependencies..."
                        bundle install
                        
                        echo "Running backend tests..."
                        rails test
                    '''
                }
            }
        }
    }
}

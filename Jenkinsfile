pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    
                '''
            }
        }
    }
}

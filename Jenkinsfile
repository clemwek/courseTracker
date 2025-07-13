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
                    '''
                }
            }
        }

        // stage('Backend Tests') {
        //     agent {
        //         docker {
        //             image 'ruby:3.2-alpine'
        //         }
        //     }
        //     steps {
        //         dir('backend') {
        //             sh '''
        //                 ls -la
        //                 ruby --version
        //                 bundle --version
        //                 echo "Installing backend dependencies..."
        //                 bundle install
        //                 echo "Running backend tests..."
        //                 bundle exec rspec
        //             '''
        //         }
        //     }
        // }
    }
}

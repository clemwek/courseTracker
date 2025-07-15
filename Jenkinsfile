pipeline {
    agent any

    stages {
        // ================= Frontend =================
        stage('Frontend Lint') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        echo "Running frontend linter..."
                        npm ci
                        npm run lint
                    '''
                }
            }
        }

        stage('Frontend Tests') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        echo "Running frontend tests..."
                        npm run test -- --ci --coverage --reporters=default --reporters=jest-junit
                    '''
                }
            }
            post {
                always {
                    junit 'frontend/junit.xml'
                    archiveArtifacts artifacts: 'frontend/coverage/**', fingerprint: true
                }
            }
        }

        stage('Frontend Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        echo "Building frontend for production..."
                        npm run build
                    '''
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/build/**', fingerprint: true
                }
            }
        }

        // ================= Backend =================
        stage('Backend Lint') {
            agent {
                docker {
                    image 'ruby:3.4.4-alpine'
                    args '-u root'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        echo "Installing build dependencies for linting..."
                        apk add --no-cache build-base yaml-dev libffi-dev

                        echo "Installing backend gems..."
                        bundle install

                        echo "Running RuboCop..."
                        bundle exec rubocop
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
                        echo "Installing build dependencies..."
                        apk add --no-cache build-base yaml-dev libffi-dev

                        echo "Installing backend gems..."
                        bundle install

                        echo "Running backend tests..."
                        bundle exec rails test
                    '''
                }
            }
            post {
                always {
                    junit 'backend/test/reports/**/*.xml' // adjust if using junit formatter with Minitest or RSpec
                    archiveArtifacts artifacts: 'backend/coverage/**', fingerprint: true
                }
            }
        }

        // ================= Deploy =================
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Approve deployment to staging?'
                sh '''
                    echo "Deploying application to staging..."
                    # Example deploy script
                    ./scripts/deploy_staging.sh
                '''
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check stages above for details.'
        }
    }
}

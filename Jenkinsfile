pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'aimen123'
        DOCKERHUB_PASSWORD = 'taskify12345'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/aimentayyab03/Taskify.git'
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"
                }
            }
        }

        stage('Pull Backend & Frontend Images') {
            steps {
                sh '''
                    docker pull aimen123/backend:latest
                    docker pull aimen123/frontend:latest
                '''
            }
        }

        stage('Run Backend & Frontend Containers') {
            steps {
                sh '''
                    docker rm -f backend-jenkins frontend-jenkins mongo-jenkins || true
                    docker run -d --name backend-jenkins -p 5000:5000 aimen123/backend:latest
                    docker run -d --name frontend-jenkins -p 3000:3000 aimen123/frontend:latest
                    docker run -d --name mongo-jenkins -p 27017:27017 mongo:latest
                '''
            }
        }

        stage('Build Selenium Test Image') {
            steps {
                dir('selenium-tests') {
                    sh 'docker build -t taskify-selenium-tests .'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                dir('selenium-tests') {
                    sh '''
                        docker run --rm \
                        -v $PWD:/app \
                        -w /app \
                        taskify-selenium-tests
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker ps -a'
        }
    }
}





// pipeline {
//     agent any

//     environment {
//         DOCKERHUB_USERNAME = 'aimen123'
//         DOCKERHUB_PASSWORD = credentials('DOCKER_HUB_PASSWORD') // Jenkins secret text
//     }

//     stages {
//         stage('Clone GitHub Repo') {
//             steps {
//                 git branch: 'master', url: 'https://github.com/aimentayyab03/Taskify.git'
//             }
//         }

//         stage('Login to DockerHub') {
//             steps {
//                 script {
//                     // Login to Docker Hub
//                     sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"
//                 }
//             }
//         }

//         stage('Stop and Remove Old Containers') {
//             steps {
//                 script {
//                     // Stop and remove existing Part-II containers to avoid conflicts
//                     sh '''
//                         docker rm -f backend-jenkins frontend-jenkins mongo-jenkins || true
//                     '''
//                 }
//             }
//         }

//         stage('Pull and Run Containers') {
//             steps {
//                 script {
//                     // Pull latest images
//                     sh 'docker pull aimen123/backend:latest'
//                     sh 'docker pull aimen123/frontend:latest'

//                     // Run containers using updated docker-compose
//                     sh 'docker-compose -f docker-compose.yml up -d'
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             // List running containers for verification
//             sh 'docker ps -a'
//         }
//     }
// }

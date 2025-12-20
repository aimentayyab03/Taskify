
pipeline {
    agent any

    environment {
        // Environment variables for Selenium tests
        BASE_URL = "http://frontend:80"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Pull Latest Images') {
            steps {
                echo 'Pulling latest Docker images...'
                sh '''
                    docker pull aimen123/frontend-v3:latest
                    docker pull aimen123/backend-v2:latest
                    docker pull aimen123/taskify-selenium:latest
                '''
            }
        }

        stage('Setup Docker Network') {
            steps {
                echo 'Creating Docker network...'
                sh 'docker network create taskify-net || true'
            }
        }

        stage('Run Backend & Frontend') {
            steps {
                echo 'Starting Backend and Frontend containers...'
                sh '''
                    docker rm -f backend || true
                    docker rm -f frontend || true

                    docker run -d --name backend --network taskify-net -p 5000:5000 aimen123/backend-v2:latest
                    docker run -d --name frontend --network taskify-net -p 3000:80 aimen123/frontend-v3:latest
                '''
            }
        }

        stage('Wait for Frontend') {
            steps {
                echo 'Waiting for frontend to start...'
                sh 'sleep 15'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                sh '''
                    docker run --rm --network taskify-net -e BASE_URL=http://frontend:80 aimen123/taskify-selenium:latest
                '''
            }
        }
    }

    post {
        always {
            echo 'Sending build results via email...'
            emailext(
                subject: "${currentBuild.fullDisplayName} - ${currentBuild.currentResult}",
                body: """<p>Build Status: ${currentBuild.currentResult}</p>
                         <p>Check console output at <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>""",
                to: "qasimalik@gmail.com",
                mimeType: 'text/html'
            )

            echo 'Cleaning up containers and network...'
            sh '''
                docker rm -f backend || true
                docker rm -f frontend || true
                docker network rm taskify-net || true
            '''
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

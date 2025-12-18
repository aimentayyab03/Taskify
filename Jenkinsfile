pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "aimen123/frontend-v3:latest"
        BACKEND_IMAGE = "aimen123/backend-v2:latest"
        SELENIUM_IMAGE = "aimen123/taskify-selenium:latest"
        EMAIL_RECIPIENT = "aimentayyab215@gmail.com"
    }

    stages {
        stage('Pull Latest Images') {
            steps {
                sh """
                    docker pull $FRONTEND_IMAGE
                    docker pull $BACKEND_IMAGE
                    docker pull $SELENIUM_IMAGE
                """
            }
        }

        stage('Setup Docker Network') {
            steps {
                sh "docker network create taskify-net || true"
            }
        }

        stage('Run Backend & Frontend') {
            steps {
                sh """
                    docker rm -f backend || true
                    docker rm -f frontend || true

                    docker run -d --name backend --network taskify-net -p 5000:5000 $BACKEND_IMAGE
                    docker run -d --name frontend --network taskify-net -p 3000:80 $FRONTEND_IMAGE
                """
            }
        }

        stage('Wait for Frontend') {
            steps {
                echo "Waiting for frontend to start..."
                sh "sleep 15"  // give frontend some time
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh """
                    docker run --rm --network taskify-net -e BASE_URL=http://frontend:80 $SELENIUM_IMAGE
                """
            }
        }
    }

    post {
        always {
            echo "Sending email..."
            emailext(
                subject: "Taskify Pipeline - ${currentBuild.currentResult}",
                body: "Pipeline finished. Check build: ${env.BUILD_URL}",
                to: "${EMAIL_RECIPIENT}"
            )

            echo "Cleaning up..."
            sh """
                docker rm -f backend || true
                docker rm -f frontend || true
                docker network rm taskify-net || true
            """
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

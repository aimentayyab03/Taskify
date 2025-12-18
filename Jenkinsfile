pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "aimen123/frontend-v3:latest"
        BACKEND_IMAGE = "aimen123/backend-v2:latest"
        SELENIUM_IMAGE = "aimen123/taskify-selenium:latest"
        EMAIL_RECIPIENT = "aimentayyab215@gmail.com"
        FRONTEND_PORT = "80" // Internal container port
        BACKEND_PORT = "5000"
    }

    stages {
        stage('Pull Latest Images') {
            steps {
                echo "Pulling latest Docker images..."
                sh """
                docker pull $FRONTEND_IMAGE
                docker pull $BACKEND_IMAGE
                docker pull $SELENIUM_IMAGE
                """
            }
        }

        stage('Setup Docker Network') {
            steps {
                echo "Creating Docker network..."
                sh """
                docker network inspect taskify-net >/dev/null 2>&1 || docker network create taskify-net
                """
            }
        }

        stage('Run Backend & Frontend') {
            steps {
                echo "Starting Backend and Frontend containers..."
                sh """
                docker rm -f backend frontend >/dev/null 2>&1 || true

                docker run -d --name backend --network taskify-net -p $BACKEND_PORT:$BACKEND_PORT $BACKEND_IMAGE
                docker run -d --name frontend --network taskify-net -p 3000:$FRONTEND_PORT $FRONTEND_IMAGE

                # Wait for frontend to be ready
                echo "Waiting for frontend to be ready..."
                for i in \$(seq 1 20); do
                    if curl -s http://localhost:3000 > /dev/null; then
                        echo "Frontend is up!"
                        break
                    fi
                    echo "Waiting 3s..."
                    sleep 3
                done
                """
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo "Running Selenium tests..."
                sh """
                docker run --rm --network taskify-net -e BASE_URL=http://frontend:$FRONTEND_PORT $SELENIUM_IMAGE
                """
            }
        }
    }

    post {
        always {
            echo "Cleaning up containers and network..."
            sh """
            docker rm -f backend frontend >/dev/null 2>&1 || true
            docker network rm taskify-net >/dev/null 2>&1 || true
            """

            echo "Sending test results via email..."
            emailext(
                subject: "Taskify Selenium Test Results - ${currentBuild.currentResult}",
                body: "Selenium tests executed on EC2 using Docker.\n\nBuild URL: ${env.BUILD_URL}",
                to: "${EMAIL_RECIPIENT}"
            )
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

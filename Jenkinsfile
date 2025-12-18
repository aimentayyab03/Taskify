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
                echo "Pulling latest Docker images..."
                sh """
                docker pull $FRONTEND_IMAGE
                docker pull $BACKEND_IMAGE
                docker pull $SELENIUM_IMAGE
                """
            }
        }

        stage('Run Backend & Frontend') {
            steps {
                echo "Starting Backend and Frontend containers..."
                sh """
                # Remove old containers if they exist
                docker rm -f backend || true
                docker rm -f frontend || true

                # Start containers
                docker run -d --name backend -p 5000:5000 $BACKEND_IMAGE
                docker run -d --name frontend -p 3000:3000 $FRONTEND_IMAGE
                """
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo "Running Selenium tests..."
                sh """
                docker run --rm --network host $SELENIUM_IMAGE
                """
            }
        }
    }

    post {
        always {
            echo "Sending test results via email..."
            emailext(
                subject: "Taskify Selenium Test Results - ${currentBuild.currentResult}",
                body: "Selenium tests executed on EC2 using Docker.\n\nBuild URL: ${env.BUILD_URL}",
                to: "${EMAIL_RECIPIENT}"
            )

            echo "Cleaning up containers..."
            sh """
            docker rm -f backend || true
            docker rm -f frontend || true
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

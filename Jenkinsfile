pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'aimen123'
        DOCKERHUB_PASSWORD = credentials('DOCKER_HUB_PASSWORD') // Jenkins secret
    }

    stages {
        stage('Clone GitHub Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/aimentayyab03/Taskify.git'
            }
        }

        stage('Build and Run Containers') {
            steps {
                script {
                    // Login to Docker Hub securely
                    sh 'echo "$DOCKERHUB_PASSWORD" | docker login -u $DOCKERHUB_USERNAME --password-stdin'

                    // Build and run containers using docker-compose
                    sh 'docker-compose -f docker-compose.yml up -d --build'
                }
            }
        }

        stage('Push Docker Images to Hub') {
            steps {
                script {
                    sh "docker push ${DOCKERHUB_USERNAME}/taskify-backend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/taskify-frontend:latest"
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

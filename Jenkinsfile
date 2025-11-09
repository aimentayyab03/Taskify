pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'aimen123'
        DOCKERHUB_PASSWORD = credentials('DOCKER_HUB_PASSWORD') // Jenkins secret text
    }

    stages {
        stage('Clone GitHub Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/aimentayyab03/Taskify.git'
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    // Login to Docker Hub
                    sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"
                }
            }
        }

        stage('Pull and Run Containers') {
            steps {
                script {
                    // Pull images from DockerHub
                    sh 'docker pull aimen123/backend:latest'
                    sh 'docker pull aimen123/frontend:latest'

                    // Run containers using docker-compose
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        always {
            // Verify running containers
            sh 'docker ps -a'
        }
    }
}

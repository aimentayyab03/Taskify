pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'aimen123/taskify:latest'
    }

    stages {
        stage('Clone GitHub Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/aimentayyab03/Taskify.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image from Dockerfile
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Push Docker Image to Hub') {
            steps {
                script {
                    // Log in to Docker Hub and push
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u aimen123 --password-stdin'
                    docker.push("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    // Run containers using modified docker-compose for Jenkins
                    sh 'docker-compose -f docker-compose-jenkins.yml up -d'
                }
            }
        }
    }

    post {
        always {
            // Show running containers for verification
            sh 'docker ps -a'
        }
    }
}

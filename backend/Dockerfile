# download to docker container maven and jdk from official docker image maven:3.9-eclipse-temurin-21-noble and
# set alias(name) for this image - build
FROM maven:3.9-eclipse-temurin-21-noble AS build
# set the directory in the container -> linux (ubuntu) where we gonna download all the files
WORKDIR /app
# copy to /app pom.xml file from /backend project dir
COPY pom.xml .
# tell maven to download all the dependencies from pom.xml file and do this in the silent mode (-B flag)
# without promting us with additional options
RUN mvn dependency:go-offline -B
# copying the project src dir to container /app/src directory
COPY src ./src
# compile code and put all compiled code and dependencies to .jar archive, because
# through jar file system can execute the code.
RUN mvn package -DskipTests
# create new container which cotnains JRE only (basically java virtual machine to run java code)
FROM eclipse-temurin:21-jre-noble
# create an app directory in the root
WORKDIR /app
# copy from previous container the whatever file with a .jar extension
COPY --from=build /app/target/*.jar app.jar
# open 8080 for the current container
EXPOSE 8080
# tells jvm to run app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
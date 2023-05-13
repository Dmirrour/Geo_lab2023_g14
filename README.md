This project was created from the archetype "wildfly-jakartaee-ear-archetype".

To deploy it:
Run the maven goals "install wildfly:deploy"

To undeploy it:
Run the maven goals "wildfly:undeploy"

==========================

DataSource:
This sample includes a "persistence.xml" file in the EJB project. This file defines
a persistence unit "Geo_lab2023_g14PersistenceUnit" which uses the JakartaEE default database.

In production environment, you should define a database in WildFly config and point to this database
in "persistence.xml".

If you don't use entity beans, you can delete "persistence.xml".
==========================

JSF:
The web application is prepared for JSF 4.0 by bundling an empty "faces-config.xml" in "src/main/webapp/WEB-INF".
In case you don't want to use JSF, simply delete this file and "src/main/webapp/beans.xml".
==========================

Testing:
This sample is prepared for running unit tests with the Arquillian framework.

The configuration can be found in "Geo_lab2023_g14/pom.xml":

Three profiles are defined:
-"default": no integration tests are executed.
-"arq-remote": you have to start a WildFly server on your machine. The tests are executed by deploying 
 the application to this server.
 Here the "maven-failsafe-plugin" is enabled so that integration tests can be run.
 Run maven with these arguments: "clean verify -Parq-remote"
-"arq-managed": this requires the environment variable "JBOSS_HOME" to be set: 
 The server found in this path is started and the tests are executed by deploying the application to this server.
 Instead of using this environment variable, you can also define the path in "arquillian.xml".
 Here the "maven-failsafe-plugin" is enabled so that integration tests can be run.
 Run maven with these arguments: "clean verify -Parq-managed"

The Arquillian test runner is configured with the file "src/test/resources/arquillian.xml" 
(duplicated in EJB and WEB project, depending where your tests are placed).
The profile "arq-remote" uses the container qualifier "remote" in this file.
The profile "arq-managed" uses the container qualifier "managed" in this file.


Unit tests can be added to EJB project and/or to Web project.

The web project contains an integration test "SampleIT" which shows how to create the deployable EAR file using the ShrinkWrap API.
You can delete this test file if no tests are necessary.

Why integration tests instead of the "maven-surefire-plugin" testrunner?
The Arquillian test runner deploys the EAR file to the WildFly server and thus you have to build it yourself with the ShrinkWrap API.
The goal "verify" (which triggers the maven-surefire-plugin) is executed later in the maven build lifecyle than the "test" goal so that the target 
artifacts ("Geo_lab2023_g14-ejb.jar" and "Geo_lab2023_g14-web.war") are already built. You can build
the final EAR by including those files. The "maven-surefire-plugin" is executed before the JAR/WAR files
are created, so those JAR/WAR files would have to be built in the "@Deployment" method, too. 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Tecnologias utilizadas

>Persistencia 3.0

>WildFly 27.0.1

>PostgreSQL 42.6.0


## Java
>Java 11.0.18

# IntelliJ plugins
>Arquillian jet Brain 231.8109.9

>Jakarta EE: Enterprse Java Beans (EJB) 231.8109.9

>Jakarta EE: Server Faces (JSF)


GeoServer versión 2.19.7  .bin .exe  futuro posible .war

Apache Tomcat/9.0.74
geoserver 2.19.7.
 




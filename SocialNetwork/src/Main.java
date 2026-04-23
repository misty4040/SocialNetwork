import java.util.*;


public class Main {
//    1. Add User
//2. Connect Users
//3. Show Network
//4. Find Influencer
//5. Exit

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Graph graph = new Graph();

        while (true) {

            System.out.println("\n1. Add User");
            System.out.println("2. Add Connection");
            System.out.println("3. Show Network");
            System.out.println("4. Find Influencer");
            System.out.println("5. Find Shortest Path");
            System.out.println("6. Recommend Friends");
            System.out.println("7. Find Communities");
            System.out.println("8. Exit");


            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    System.out.print("Enter user name: ");
                    String user = sc.nextLine();
                    graph.addUser(user);
                    break;

                case 2:
                    System.out.print("Enter first user: ");
                    String u1 = sc.nextLine();
                    System.out.print("Enter second user: ");
                    String u2 = sc.nextLine();
                    graph.addConnection(u1, u2);
                    break;

                case 3:
                    graph.printNetwork();
                    break;

                case 4:
                    graph.findInfluencer();
                    break;

                case 5:
                    System.out.print("Enter start user: ");
                    String start = sc.nextLine();
                    System.out.print("Enter end user: ");
                    String end = sc.nextLine();
                    graph.shortestPath(start, end);
                    break;

                case 6:
                    System.out.print("Enter user name: ");
                    String userName = sc.nextLine();
                    graph.recommendFriends(userName);
                    break;

                case 7:
                    graph.findCommunities();
                    break;

                case 8:
                    System.exit(0);

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }


}
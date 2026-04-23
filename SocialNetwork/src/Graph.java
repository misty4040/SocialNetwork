import java.util.*;
public class Graph {

//    Ye class sirf data store karegi.
//
//    Isme hoga:
//            •	HashMap<String, ArrayList>

    private HashMap<String, ArrayList<String>> adjacencyList;

    public Graph() {
        adjacencyList = new HashMap<>();
    }

    public void addUser(String user) {
        if (!adjacencyList.containsKey(user)) {
            adjacencyList.put(user, new ArrayList<>());
            System.out.println("User added successfully!");
        } else {
            System.out.println("User already exists!");
        }
    }

    public void addConnection(String user1, String user2) {
        if (adjacencyList.containsKey(user1) && adjacencyList.containsKey(user2)) {
            adjacencyList.get(user1).add(user2);
            adjacencyList.get(user2).add(user1);
            System.out.println("Connection added!");
        } else {
            System.out.println("One or both users not found!");
        }
    }

    public void printNetwork() {
        for (String user : adjacencyList.keySet()) {
            System.out.println(user + " -> " + adjacencyList.get(user));
        }
    }

    public HashMap<String, ArrayList<String>> getGraph() {
        return adjacencyList;
    }

    public void findInfluencer() {

        String influencer = null;
        int maxConnections = -1;

        for (String user : adjacencyList.keySet()) {
            int connections = adjacencyList.get(user).size();

            if (connections > maxConnections) {
                maxConnections = connections;
                influencer = user;
            }
        }

        if (influencer != null) {
            System.out.println("Influencer is: " + influencer);
            System.out.println("Connections: " + maxConnections);
        } else {
            System.out.println("No users in network!");
        }
    }

    public void shortestPath(String start, String end) {

        if (!adjacencyList.containsKey(start) || !adjacencyList.containsKey(end)) {
            System.out.println("One or both users not found!");
            return;
        }

        Queue<String> queue = new LinkedList<>();
        HashSet<String> visited = new HashSet<>();
        HashMap<String, String> parent = new HashMap<>();

        queue.add(start);
        visited.add(start);
        parent.put(start, null);

        while (!queue.isEmpty()) {
            String current = queue.poll();

            if (current.equals(end)) {
                break;
            }

            for (String neighbor : adjacencyList.get(current)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                    parent.put(neighbor, current);
                }
            }
        }

        // If no path
        if (!parent.containsKey(end)) {
            System.out.println("No path found!");
            return;
        }

        // Reconstruct path
        ArrayList<String> path = new ArrayList<>();
        String step = end;

        while (step != null) {
            path.add(step);
            step = parent.get(step);
        }

        Collections.reverse(path);

        System.out.println("Shortest Path: " + path);


    }

    public void recommendFriends(String user) {

    if (!adjacencyList.containsKey(user)) {
        System.out.println("User not found!");
        return;
    }

    HashSet<String> directFriends = new HashSet<>(adjacencyList.get(user));
    HashMap<String, Integer> recommendationCount = new HashMap<>();

    for (String friend : directFriends) {

        for (String mutual : adjacencyList.get(friend)) {

            if (!mutual.equals(user) && !directFriends.contains(mutual)) {

                recommendationCount.put(
                        mutual,
                        recommendationCount.getOrDefault(mutual, 0) + 1
                );
            }
        }
    }

    if (recommendationCount.isEmpty()) {
        System.out.println("No recommendations available.");
        return;
    }

    System.out.println("Friend Recommendations for " + user + ":");

        for (String recommended : recommendationCount.keySet()) {
            System.out.println(recommended + 
                " (Mutual Friends: " + recommendationCount.get(recommended) + ")");
        }
    }
    public void findCommunities() {

        HashSet<String> visited = new HashSet<>();
        int communityNumber = 1;

        for (String user : adjacencyList.keySet()) {

            if (!visited.contains(user)) {

                System.out.print("Community " + communityNumber + ": ");
                dfs(user, visited);
                System.out.println();

                communityNumber++;
            }
        }
    }

    private void dfs(String user, HashSet<String> visited) {

    visited.add(user);
    System.out.print(user + " ");

    for (String neighbor : adjacencyList.get(user)) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited);
        }
    }
}
}

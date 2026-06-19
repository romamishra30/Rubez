#ifndef EDGES_H
#define EDGES_H

#include "Cube.hpp"

class Edges {

public:
  static void solveEdges(Cube &cube); // REVIEW LATER
private:
  static void solveEdge(Cube &cube); // REVIEW LATER
  static int checkEdges(Cube &cube);
};

#endif

#ifndef CUBE_H
#define CUBE_H

#include <iostream>
using namespace std;

class Cube {
public:
  int cubies[9][6];

  Cube(bool);

private:
  void scramble();

public:
  string printSequence(string);
  void moves(string);
  void applyMoves(string);
  void output();
  void R(int);
  void L(int);
  void U(int);
  void D(int);
  void F(int);
  void B(int);
};

#endif
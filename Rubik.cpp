#include "Cube.hpp"
#include "Cross.hpp"
#include "Corners.hpp"
#include "Edges.hpp"
#include "OLL.hpp"
#include "PLL.hpp"
#include <iostream>
using namespace std;

string format(string);

int main(int argc, char **argv) {

  Cube myCube(false);
    int scrambleNum = 0;
    string argString;
    while (getline(cin, argString)) {
    ++scrambleNum;
    string scramble = format(argString);
    cout << "Scramble #" << scrambleNum << ": ";
    myCube.moves(scramble);
    Cross::solveCross(myCube);
    cout << "Cross solved" << endl;
    Corners::solveCorners(myCube);
    cout << "Corners solved" << endl;
    Edges::solveEdges(myCube);
    cout << "Edges solved" << endl;;
    OLL::solveOLL(myCube);
    cout << "OLL solved" << endl;
    PLL::solvePLL(myCube);
    cout << "PLL solved" << endl;
  }
  return 0;
}

string format(string s) {
  string formatted;

  for (int i=0; i<s.length(); ++i) {
    if (s[i] == '\'') {
      formatted += s[i-1];
      formatted += s[i-1];
    }
    else if (s[i] == '2') {
      formatted += s[i-1];
    }
    else if (s[i] == ' ') {

    }
    else {
      formatted += s[i];
    }
  }

  return formatted;

}
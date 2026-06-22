#include "Cube.hpp"
#include "Cross.hpp"
#include "Corners.hpp"
#include "Edges.hpp"
#include "OLL.hpp"
#include "PLL.hpp"
#include <iostream>
using namespace std;

string format(string);

int main(int argc, char **argv)
{
  string argString;

  while (getline(cin, argString))
  {
    Cube myCube(false);

    string scramble = format(argString);

    myCube.applyMoves(scramble);

    cout << "[STAGE] Cross" << endl;
    Cross::solveCross(myCube);

    cout << "[STAGE] First Layer Corners" << endl;
    Corners::solveCorners(myCube);

    cout << "[STAGE] Middle Layer Edges" << endl;
    Edges::solveEdges(myCube);

    cout << "[STAGE] Orient Last Layer" << endl;
    OLL::solveOLL(myCube);

    cout << "[STAGE] Permute Last Layer" << endl;
    PLL::solvePLL(myCube);

    cout << endl;
  }

  return 0;
}

string format(string s)
{
  string formatted;

  for (int i = 0; i < s.length(); ++i)
  {
    if (s[i] == '\'')
    {
      formatted += s[i - 1];
      formatted += s[i - 1];
    }
    else if (s[i] == '2')
    {
      formatted += s[i - 1];
    }
    else if (s[i] == ' ')
    {
    }
    else
    {
      formatted += s[i];
    }
  }

  return formatted;
}
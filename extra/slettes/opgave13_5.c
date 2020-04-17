#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LGT 50
#define MAX_PERSON 11

struct person{
    char fornavn[MAX_NAME_LGT];
    char efternavn[MAX_NAME_LGT];
    char vejnavn[MAX_NAME_LGT];
    int  vejnummer;
    int  postnummer;
    char bynavn[MAX_NAME_LGT];
};
typedef struct person person;

int compare (const void *a, const void *b);

int main () {
    person personer[MAX_NAME_LGT];
    int i = 0, j = 0;
    char str[MAX_NAME_LGT];
    FILE *address_reader = fopen("addresser.txt", "r");

    while (fgets(str, MAX_NAME_LGT, address_reader) != NULL) {
        sscanf(str, " %s %[^,] , %[^0123456789] %d , %d %[^.]", 
            personer[i].fornavn, personer[i].efternavn, 
            personer[i].vejnavn, &personer[i].vejnummer,
            &personer[i].postnummer, personer[i].bynavn);
        i++;
    }
    fclose(address_reader);
    qsort(personer, MAX_PERSON, sizeof(struct person), compare);
    for (j = 0; j < i; j++) {
        printf("%s, %s\n", personer[j].bynavn, personer[j].efternavn);
    }
    
    return 0;
}

int compare (const void *a, const void *b) {
    person *ia = (person *)a;
    person *ib = (person *)b;

    return strcmp(ia -> efternavn, ib -> efternavn);
}
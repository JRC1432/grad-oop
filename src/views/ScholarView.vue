<template>
  <div class="q-pa-md">
    <div class="col-xs-12 col-sm-6">
      <div class="q-col-gutter-md row items-start">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="my-card text-black rounded-borders-20 q-mr-md cards" flat>
            <q-card-section>
              <div class="text-h6 text-primary">View Scholars</div>
              <div class="text-subtitle2 text-primary">Scholars Table</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-card flat>
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey cards"
                  active-color="primary"
                  indicator-color="primary"
                  align="left"
                  narrow-indicator
                >
                  <q-tab name="oscholars" label="Ongoing" />
                  <q-tab name="gradscholars" label="Graduated" />

                  <q-tab name="termscholars" label="Terminated" />
                </q-tabs>

                <!-- Ongoing Scholars -->

                <q-tab-panels v-model="tab" animated class="cards">
                  <q-tab-panel name="oscholars">
                    <ScholarsTbl
                      :rows="onrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>

                  <!-- Graduate Scholars -->

                  <q-tab-panel name="gradscholars">
                    <ScholarsTbl
                      :rows="gradrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>

                  <!-- Terimnated Scholars -->

                  <q-tab-panel name="termscholars">
                    <ScholarsTbl
                      :rows="termrows"
                      :columns="columns"
                      :showfile="handleFiles"
                      @row-click="handleRowClick"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-6">
          <q-card class="my-card rounded-borders-20 cards" flat>
            <form id="submitScholarForm" @submit.prevent.stop="submitScholar">
              <div class="q-pa-md">
                <div class="row items-center q-col-gutter-md q-mb-md">
                  <!-- Left Column: Title -->
                  <div class="col-12 col-md">
                    <div class="text-h6 text-bold row items-center">
                      <span
                        :class="['text-h6 text-bold', isEditing ? 'text-warning' : 'text-primary']"
                      >
                        {{
                          isEditing
                            ? 'EDIT Scholarship Information Details'
                            : 'NEW Scholarship Information Details'
                        }}
                      </span>
                    </div>
                  </div>

                  <!-- Right Column: Buttons -->
                  <div class="col-12 col-md-auto">
                    <div class="row justify-end q-gutter-sm">
                      <BaseBtn
                        btnlabel="Batch Upload"
                        @click="docxUpload = true"
                        icon="cloud_upload"
                        flat
                        v-if="!isEditing"
                      />
                      <BaseBtn
                        btnlabel="New Scholar"
                        @click="newScholar"
                        icon="school"
                        flat
                        v-if="isEditing"
                      />
                      <BaseBtn
                        btnlabel="Print"
                        @click="generatePDF"
                        icon="print"
                        flat
                        v-if="isEditing"
                      />
                      <BaseBtn
                        :btnlabel="isEditing ? 'Save Changes' : 'Submit New Scholar'"
                        type="submit"
                        flat
                      />
                    </div>
                  </div>
                </div>

                <q-separator />

                <q-card-section>
                  <q-scroll-area style="height: 840px; width: 100%">
                    <div class="col-12">
                      <div class="q-col-gutter-md row items-start">
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Level"
                            name="spas_level"
                            v-model="level"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="Current Year"
                            name="currentYear"
                            v-model="currentYear"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Region"
                            name="spas_region"
                            v-model="state.region"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-3 col-md-3">
                          <BaseInputRead
                            title="SPAS Academic Year"
                            name="spas_academic_year"
                            v-model="spas_academic_year"
                            v-if="isEditing == false"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-md-4" v-if="isEditing">
                          <BaseInputRead title="SPAS ID" name="spasid" v-model="state.spasid" />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-sm-4" v-if="isEditing">
                          <BaseSelect
                            ref="refStatus"
                            title="Status"
                            name="status"
                            v-model="status"
                            :options="statusOptions"
                            :filter-fn="filterStatus"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-4 col-md-4" v-if="isEditing">
                          <BaseSelect
                            ref="refSubStatus"
                            title="Sub Status"
                            name="substatus"
                            v-model="substatus"
                            :options="substatusOptions"
                            :filter-fn="filterSubStatus"
                            :rules="[isSelected]"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="First Name"
                            ref="reffirstname"
                            name="firstname"
                            v-model="state.firstname"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Middle Name"
                            name="middlename"
                            v-model="state.middlename"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Last Name"
                            ref="reflastname"
                            name="lastname"
                            v-model="state.lastname"
                            :rules="[requiredField]"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Suffix Name"
                            name="suffixname"
                            v-model="state.suffixname"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Birthday"
                            ref="refbirth"
                            name="birth"
                            v-model="state.birth"
                            :rules="[requiredField]"
                            type="date"
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <div class="row justify-start">
                            <BaseBasicSelect
                              ref="refsex"
                              name="sex"
                              title="Sex"
                              :options="sexOptions"
                              v-model="sex"
                              :rules="[requiredField]"
                            />
                          </div>
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <span class="text-h6 text-bold text-primary">Contact Information</span>
                          </div>
                          <q-separator />
                          <br />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="E-mail"
                            ref="refemail"
                            name="email"
                            v-model="state.email"
                            :rules="[requiredField]"
                            placeholder="Please make sure that your e-mail is valid"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Alternate E-mail"
                            ref="refalemail"
                            name="alemail"
                            v-model="state.alemail"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Contact"
                            ref="refcontact"
                            name="contact"
                            v-model="state.contact"
                            mask="(####) ###-####"
                            placeholder="(09##) ###-####"
                            type="tel"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <UpdateSelect
                            ref="refzipcode"
                            title="Zip Code"
                            name="zipcode"
                            v-model="zipcode"
                            :options="zipcodeOptions"
                            :onFilter="filterZipcode"
                            @update:modelValue="populateAddress"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            ref="refblocklot"
                            title="Block/Lot/House No."
                            name="blocklot"
                            v-model="state.blocklot"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            ref="refstreet"
                            title="Compound/Street/Phase/Purok"
                            name="street"
                            v-model="state.street"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Subdivision/Village"
                            name="subdivision"
                            v-model="state.subdivision"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput title="Barangay" name="barangay" v-model="state.barangay" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="District"
                            name="district"
                            v-model="state.district"
                            readonly
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Region" name="region" v-model="state.region" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="Municipality/City"
                            name="municipality"
                            v-model="state.municipality"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <BaseInputRead
                            title="Province"
                            name="province"
                            v-model="state.province"
                          />
                        </div>
                        <br />
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <span class="text-h6 text-bold text-primary"
                              >Previous School Informations</span
                            >
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refPrevCourse"
                            title="Previous Course"
                            name="prevCourse"
                            v-model="prevCourse"
                            :options="prevCourseOptions"
                            :filter-fn="filterPrevCourse"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refPrevSchool"
                            title="Previous School"
                            name="prevschool"
                            v-model="prevschool"
                            :options="prevSchoolOptions"
                            :filter-fn="filterPrevSchool"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refScProg"
                            title="Scholarship Program"
                            name="scprog"
                            v-model="scprog"
                            :options="ScProgramOptions"
                            :filter-fn="filterScProgram"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Units"
                            ref="refunits"
                            name="units"
                            v-model="state.units"
                            :rules="[requiredField]"
                            type="number"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <span class="text-h6 text-bold text-primary">Graduate School</span>
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12">
                          <BaseSelect
                            ref="refcouncil"
                            title="Monitoring Council/ University"
                            name="council"
                            v-model="council"
                            :options="councilOptions"
                            :filter-fn="filterCouncil"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refgradschool"
                            title="Graduate School"
                            name="gradschool"
                            v-model="gradschool"
                            :options="gradschoolOptions"
                            :onFilter="filterGradschool"
                            @update:modelValue="populateschool"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="School Region"
                            name="schoolregion"
                            v-model="state.schoolregion"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refgradcourse"
                            title="Graduate Course"
                            name="gradcourse"
                            v-model="gradcourse"
                            :options="gradcourseOptions"
                            :onFilter="filterGradcourse"
                            @update:modelValue="populateCourseField"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Field" name="fields" v-model="state.fields" />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Duration"
                            ref="refduration"
                            name="duration"
                            v-model="state.duration"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <q-list bordered class="rounded-borders">
                            <q-expansion-item
                              expand-separator
                              icon="school"
                              label="Foreign"
                              caption="Scholar"
                            >
                              <q-card>
                                <q-card-section>
                                  <div class="col-xs-12 col-sm-6">
                                    <div class="q-col-gutter-md row items-start">
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refForeignsemone"
                                          name="foreignsemone"
                                          v-model="state.foreignsemone"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Start Date"
                                          ref="refForeignstartdate"
                                          name="foreignstartdate"
                                          v-model="state.foreignstartdate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refForeignsemtwo"
                                          name="foreignsemtwo"
                                          v-model="state.foreignsemtwo"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Date Expected to Graduate"
                                          ref="refForeignenddate"
                                          name="foreignenddate"
                                          v-model="state.foreignenddate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-expansion-item>

                            <q-expansion-item
                              expand-separator
                              icon="school"
                              label="Local"
                              caption="Scholar"
                            >
                              <q-card>
                                <q-card-section>
                                  <div class="col-xs-12 col-sm-6">
                                    <div class="q-col-gutter-md row items-start">
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refLocalsemone"
                                          name="localsemone"
                                          v-model="state.localsemone"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Start Date"
                                          ref="refLocalstartdate"
                                          name="localstartdate"
                                          v-model="state.localstartdate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                      <div class="col-xs-12 col-sm-1 col-md-1">
                                        <BaseInput
                                          title="Sem"
                                          ref="refLocalsemtwo"
                                          name="localsemtwo"
                                          v-model="state.localsemtwo"
                                          :rules="[requiredField]"
                                          type="number"
                                        />
                                      </div>

                                      <div class="col-xs-12 col-sm-5 col-md-5">
                                        <BaseInput
                                          title="Date Expected to Graduate"
                                          ref="refLocalEnddate"
                                          name="localenddate"
                                          v-model="state.localenddate"
                                          :rules="[requiredField]"
                                          type="date"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </q-card-section>
                              </q-card>
                            </q-expansion-item>
                          </q-list>
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-12">
                          <div class="text-h6 text-bold q-mb-md row items-center">
                            <span class="text-h6 text-bold text-primary"
                              >Scholarship Informations</span
                            >
                          </div>
                          <q-separator />
                          <br />
                        </div>
                        <div class="col-xs-12">
                          <BaseSelect
                            ref="refScholarshipProgram"
                            title="Scholarship Program"
                            name="scholarshipProgram"
                            v-model="scholarshipProgram"
                            :options="scholarshipProgramOptions"
                            :filter-fn="filterScholarshipProgram"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refEntryType"
                            title="Entry Type"
                            name="entryType"
                            v-model="entryType"
                            :options="entryTypeOptions"
                            :filter-fn="filterEntryType"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Academic Year"
                            ref="refacademicyear"
                            name="academicyear"
                            v-model="state.academicyear"
                            :rules="[requiredField]"
                            mask="####-####"
                            placeholder="YYYY-YYYY"
                            @update:model-value="
                              spas_academic_year = state.academicyear.substring(0, 4)
                            "
                          />
                        </div>

                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Batch"
                            ref="refbatch"
                            name="batch"
                            v-model="state.batch"
                            :rules="[requiredField]"
                            type="number"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refgrant"
                            title="Grant"
                            name="grant"
                            v-model="grant"
                            :options="grantOptions"
                            :filter-fn="filterGrant"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="reflevel"
                            title="Level"
                            name="level"
                            v-model="level"
                            :options="levelOptions"
                            :filter-fn="filterLevel"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Comp" name="comp" v-model="state.comp" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseSelect
                            ref="refavailment"
                            title="Availment"
                            name="availment"
                            v-model="availment"
                            :options="availmentOptions"
                            :filter-fn="filterAvailment"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Status" name="otherstatus" v-model="availment" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead title="Semester" name="semester" v-model="state.batch" />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInputRead
                            title="Year of Award"
                            name="yearawarded"
                            v-model="spas_academic_year"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Title of Research"
                            ref="refresearch"
                            name="research"
                            v-model="state.research"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <UpdateSelect
                            ref="refscholartype"
                            title="Scholar Type"
                            name="scholartype"
                            v-model="scholartype"
                            :options="scholartypeOptions"
                            :onFilter="filterScholarType"
                            @update:modelValue="populateScholarType"
                            :rules="[isSelected]"
                          />
                        </div>
                        <div class="col-xs-12 col-sm-6 col-md-6">
                          <BaseInput
                            title="Graduation Date"
                            ref="refgraduationdate"
                            name="graduationdate"
                            v-model="state.graduationdate"
                            :rules="[requiredField]"
                            mask="####-##"
                            placeholder="YYYY-MM"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Honors/Awards Received"
                            ref="refhonorsawards"
                            name="honorsawards"
                            v-model="state.honorsawards"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Dissemination Grant"
                            ref="refdissemination"
                            name="dissemination"
                            v-model="state.dissemination"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Research Grant"
                            ref="refresearchGrant"
                            name="researchgrant"
                            v-model="state.researchgrant"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Service Obligation"
                            ref="refserviceobligation"
                            name="serviceobligation"
                            v-model="state.serviceobligation"
                            type="number"
                            :rules="[requiredField]"
                          />
                        </div>
                        <div class="col-xs-12">
                          <BaseInput
                            title="Remarks"
                            ref="refremarks"
                            name="remarks"
                            v-model="state.remarks"
                            :rules="[requiredField]"
                          />
                        </div>
                      </div></div
                  ></q-scroll-area>
                </q-card-section>
              </div>
            </form>
          </q-card>
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="docxUpload" persistent>
    <q-card class="rounded-borders-20" style="width: 700px; max-width: 80vw">
      <q-form id="bulkUploadForm" @submit.prevent.stop="bulkUploads">
        <q-toolbar>
          <IconFileTypeCsv :size="30" stroke-width="2" />

          <q-toolbar-title
            ><span class="text-weight-bold" color="primary">CSV</span> File Upload</q-toolbar-title
          >

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          <q-card class="my-card rounded-borders-20">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">Upload Your File Here</div>
              <div class="text-subtitle2">Only CSV Documents are Allowed</div>
              <div class="justify-end row">
                <q-btn
                  color="secondary"
                  size="10px"
                  no-caps
                  round
                  icon="download"
                  tag="a"
                  href="/assets/Graduate_BulkUpload.csv"
                  target="_blank"
                >
                  <q-tooltip class="bg-accentmodes"
                    >Download Scholars Records Batch Upload</q-tooltip
                  >
                </q-btn>
              </div>
            </q-card-section>
            <div class="q-pa-md">
              <q-file
                ref="rfBulkUpload"
                filled
                v-model="bulkuploadScholars"
                name="bulkuploadScholars"
                label="*CSV FILES ONLY"
                color="primary"
                clearable
                counter
                accept=".csv"
                :rules="[isFileValid]"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </q-card>
          <br />
          <div class="row justify-end">
            <BaseBtn type="submit" label="Upload" color="primary" />
          </div>
        </q-card-section>

        <q-separator />
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="Docx" persistent>
    <q-card style="min-width: 1000px; width: 1000px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">View Documents</div>
        <q-space />

        <q-btn rounded flat color="primary" v-close-popup>
          <IconSquareRoundedX :size="30" stroke-width="2" />
        </q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <form id="editDocuForm" @submit.prevent.stop="addDocu">
          <div class="col-xs-12 col-sm-6">
            <div class="q-col-gutter-md row items-start">
              <div class="col-xs-12">
                <div class="q-px-sm">
                  <span class="text-bold">Upload Files</span>
                  <q-file
                    ref="reffile"
                    v-model="files"
                    name="files"
                    label="*PDF Only"
                    clearable
                    filled
                    counter
                    outlined
                    dense
                    hide-bottom-space
                    accept=".pdf"
                    @update:model-value="handleFileChange"
                    :rules="[fileRules]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>
              <div class="col-xs-12">
                <UpdateSelect
                  ref="refFileTypes"
                  title="File Types"
                  name="filetypes"
                  v-model="filetypes"
                  :options="filetypesOptions"
                  :onFilter="filterFilesTypes"
                  @update:modelValue="getDescription"
                  :rules="[isSelected]"
                />
              </div>
              <div class="col-xs-12">
                <BaseInput
                  title="Description"
                  name="filetypedescription"
                  v-model="state.filetypedescription"
                />
              </div>
              <div class="col-xs-12">
                <BaseBtn label="Add New File" color="primary" type="submit" />
              </div>
            </div>
          </div>
        </form>
      </q-card-section>

      <q-card-section style="max-height: 50vh" class="scroll">
        <ScholarsTbl :rows="rows" :columns="doxcolumns" :showfile="showFiles" />
      </q-card-section>

      <q-separator />
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseBtn from '../components/BaseBtn.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseInputRead from '../components/BaseInputRead.vue'
import BaseFile from '../components/BaseFile.vue'

import BaseSelect from '../components/BaseSelect.vue'
import BaseBasicSelect from '../components/BaseBasicSelect.vue'
import UpdateSelect from '../components/UpdateSelect.vue'
import ScholarsTbl from '../components/ScholarsTbl.vue'
import { ref, onMounted, reactive, inject } from 'vue'
import { notifySuccess, notifyError } from '../utils/notify'

import { IconFileTypeCsv, IconSquareRoundedX } from '@tabler/icons-vue'
import { useQuasar } from 'quasar'
import { requiredField, isSelected, isFileValid } from '../utils/validation'

import Swal from 'sweetalert2'
import { compileScript } from 'vue/compiler-sfc'
import jsPDF from 'jspdf'

const user = inject('$user')
const q$ = useQuasar()
const $q = useQuasar()
const axios = inject('$axios')

const tab = ref('oscholars')
const docxUpload = ref(false)
const Docx = ref(false)

const edittab = ref('sinfo')

const rows = ref([])
const onrows = ref([])
const gradrows = ref([])
const termrows = ref([])
const isNew = ref('Create')
const isUpdate = ref('Update')
const isDelete = ref('Delete')
const isUploaded = ref('Upload')

// Ref Declarations

const rfBulkUpload = ref(null)
const refStatus = ref(null)
const refSubStatus = ref(null)
const reffirstname = ref(null)
const reflastname = ref(null)
const refbirth = ref(null)
const refsex = ref(null)
const refemail = ref(null)
const refalemail = ref(null)
const refcontact = ref(null)
const refzipcode = ref(null)
const refblocklot = ref(null)
const refstreet = ref(null)
const refPrevCourse = ref(null)
const refPrevSchool = ref(null)
const refScProg = ref(null)
const refunits = ref(null)
const refcouncil = ref(null)
const refgradschool = ref(null)
const refgradcourse = ref(null)
const refduration = ref(null)
const refForeignsemone = ref(null)
const refForeignstartdate = ref(null)
const refForeignsemtwo = ref(null)
const refForeignenddate = ref(null)
const refLocalsemone = ref(null)
const refLocalstartdate = ref(null)
const refLocalsemtwo = ref(null)
const refScholarshipProgram = ref(null)
const refEntryType = ref(null)
const refacademicyear = ref(null)
const refbatch = ref(null)
const refgrant = ref(null)
const reflevel = ref(null)
const refavailment = ref(null)
const refremarks = ref(null)
const refserviceobligation = ref(null)
const refresearch = ref(null)
const refscholartype = ref(null)
const refgraduationdate = ref(null)
const refhonorsawards = ref(null)
const refdissemination = ref(null)
const refresearchGrant = ref(null)
const refFileTypes = ref(null)
const reffile = ref(null)

// Variables Declarations

const status = ref(null)
const substatus = ref(null)
const sex = ref(null)
const zipcode = ref(null)
const prevCourse = ref(null)
const prevschool = ref(null)
const scprog = ref(null)
const council = ref(null)
const gradschool = ref(null)
const gradcourse = ref(null)
const scholarshipProgram = ref(null)
const entryType = ref(null)
const grant = ref(null)
const level = ref(null)
const availment = ref(null)
const scholartype = ref(null)
const currentYear = ref(null)
const spas_academic_year = ref(null)
const isEditing = ref(false)
const bulkuploadScholars = ref(null)
const files = ref(null)
const filetypes = ref(null)

const state = reactive({
  spasid: '',
  status: '',
  substatus: '',
  firstname: '',
  middlename: '',
  lastname: '',
  suffixname: '',
  birth: '',
  sex: '',
  email: '',
  alemail: '',
  contact: '',
  blocklot: '',
  street: '',
  subdivision: '',
  barangay: '',
  district: '',
  region: '',
  municipality: '',
  province: '',
  units: '',
  schoolregion: '',
  fields: '',
  duration: '',
  foreignsemone: '',
  foreignstartdate: '',
  foreignsemtwo: '',
  foreignenddate: '',
  localsemone: '',
  localstartdate: '',
  localenddate: '',
  localsemtwo: '',
  academicyear: '',
  batch: '',
  comp: '100m',
  otherstatus: '',
  semester: '',
  yearawarded: '',
  remarks: '',
  serviceobligation: '',
  research: '',
  graduationdate: '',
  honorsawards: '',
  dissemination: '',
  researchgrant: '',
  filetypedescription: '',
})

const sexOptions = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
]

// Columns

const columns = [
  {
    name: 'spas_id',
    required: true,
    label: 'SPAS ID',
    align: 'center',
    field: 'spas_id',
    sortable: true,
  },
  {
    name: 'lname',
    required: true,
    label: 'Last Name',
    align: 'center',
    field: 'lname',
    sortable: true,
  },
  {
    name: 'fname',
    required: true,
    label: 'First Name',
    align: 'center',
    field: 'fname',
    sortable: true,
  },
  {
    name: 'school_grad_status',
    required: true,
    label: 'Status',
    align: 'center',
    field: 'school_grad_status',
    sortable: true,
  },
  {
    name: 'sub_status',
    required: true,
    label: 'Secondary Status',
    align: 'center',
    field: 'sub_status',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Action Buttons',
    field: 'actions',
    sortable: true,
  },
]

const doxcolumns = [
  {
    name: 'file_name',
    required: true,
    label: 'File Name',
    align: 'center',
    field: 'file_name',
    sortable: true,
  },
  {
    name: 'descriptions',
    required: true,
    label: 'Details',
    align: 'center',
    field: 'descriptions',
    sortable: true,
  },
  {
    name: 'file_description',
    required: true,
    label: 'File Description',
    align: 'center',
    field: 'file_description',
    sortable: true,
  },

  {
    name: 'added_on',
    required: true,
    label: 'Date Added',
    align: 'center',
    field: 'added_on',
    sortable: true,
  },

  {
    name: 'actions',
    align: 'center',
    label: 'Action Buttons',
    field: '',
    sortable: true,
  },
]

// Read Datas

const readScholars = async () => {
  try {
    const [
      resOnrows,
      resGradrows,
      resTermrows,
      resStatus2,
      resSubstatus2,
      resZip2,
      resPrevCourse2,
      resPrevSchool2,
      resScProgram2,
      resCouncil2,
      resGradschool2,
      resGradcourse2,
      resScholarshipProgram2,
      resEntryType2,
      resGrant2,
      resLevel2,
      resAvailment2,
      resScholartype2,
    ] = await Promise.all([
      axios.get('/scholars_function.php?readscholar'),
      axios.get('/scholars_function.php?readgraduatescholar'),
      axios.get('/scholars_function.php?readtermscholar'),
      axios.get('/scholars_function.php?readStatus'),
      axios.get('/scholars_function.php?readSubStatus'),
      axios.get('/scholars_function.php?readZip'),
      axios.get('/scholars_function.php?underGradCourses'),
      axios.get('/scholars_function.php?underGradSchool'),
      axios.get('/scholars_function.php?readScProg'),
      axios.get('/scholars_function.php?readcouncil'),
      axios.get('/scholars_function.php?readGradSchool'),
      axios.get('/scholars_function.php?readGradCourse'),
      axios.get('/scholars_function.php?readScolarshipProgram'),
      axios.get('/scholars_function.php?readEntryType'),
      axios.get('/scholars_function.php?readGrant'),
      axios.get('/scholars_function.php?readLevel'),
      axios.get('/scholars_function.php?readAvailment'),
      axios.get('/scholars_function.php?readScholarType'),
    ])

    onrows.value = resOnrows.data
    gradrows.value = resGradrows.data
    termrows.value = resTermrows.data
    status2 = resStatus2.data
    substatus2 = resSubstatus2.data
    zip2 = resZip2.data
    prevCourse2 = resPrevCourse2.data
    prevSchool2 = resPrevSchool2.data
    ScProgram2 = resScProgram2.data
    council2 = resCouncil2.data
    gradschool2 = resGradschool2.data
    gradcourse2 = resGradcourse2.data
    scholarshipProgram2 = resScholarshipProgram2.data
    entryType2 = resEntryType2.data
    grant2 = resGrant2.data
    level2 = resLevel2.data
    availment2 = resAvailment2.data
    scholartype2 = resScholartype2.data
  } catch (error) {
    console.error('Error reading scholars data:', error)
    notifyError('Failed to load scholar data')
  }
}

const populateAddress = () => {
  var formData = new FormData()
  formData.append('zipid', zipcode.value)

  axios.post('/scholars_function.php?readZipAddress', formData).then(function (response) {
    state.municipality = response.data.zmun
    state.province = response.data.zpro
    state.barangay = response.data.zbar
    state.district = response.data.zdis
    state.region = response.data.zreg
  })
}

const populateschool = () => {
  var formData = new FormData()
  formData.append('schoolName', gradschool.value)

  axios.post('/scholars_function.php?gradSchoolPopulate', formData).then(function (response) {
    state.serviceobligation = response.data.duration
    state.schoolregion = response.data.school_region
  })
}

const populateCourseField = () => {
  var formData = new FormData()
  formData.append('schoolCourse', gradcourse.value)

  axios.post('/scholars_function.php?gradCoursePopulate', formData).then(function (response) {
    state.fields = response.data.field
  })
}

const populateScholarType = () => {
  var formData = new FormData()
  formData.append('scholarType_description', scholartype.value)

  axios.post('/scholars_function.php?scholarTypePopulate', formData).then(function (response) {
    state.serviceobligation = response.data.serv_obligation
  })
}

const getCurrentYear = () => {
  const currentDate = new Date()
  currentYear.value = currentDate.getFullYear()
}

// Auto polpulate codes Here

var status2 = []
const statusOptions = ref(status2)
var substatus2 = []
const substatusOptions = ref(substatus2)
var zip2 = []
const zipcodeOptions = ref(zip2)
var prevCourse2 = []
const prevCourseOptions = ref(prevCourse2)
var prevSchool2 = []
const prevSchoolOptions = ref(prevSchool2)
var ScProgram2 = []
const ScProgramOptions = ref(ScProgram2)
var council2 = []
const councilOptions = ref(council2)
var gradschool2 = []
const gradschoolOptions = ref(gradschool2)
var gradcourse2 = []
const gradcourseOptions = ref(gradcourse2)
var scholarshipProgram2 = []
const scholarshipProgramOptions = ref(scholarshipProgram2)
var entryType2 = []
const entryTypeOptions = ref(entryType2)
var grant2 = []
const grantOptions = ref(grant2)
var level2 = []
const levelOptions = ref(level2)
var availment2 = []
const availmentOptions = ref(availment2)
var scholartype2 = []
const scholartypeOptions = ref(scholartype2)

const filterStatus = (val, update, abort) => {
  if (val === '') {
    update(() => {
      statusOptions.value = status2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    statusOptions.value = status2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterSubStatus = (val, update, abort) => {
  if (val === '') {
    update(() => {
      substatusOptions.value = substatus2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    substatusOptions.value = substatus2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterZipcode = (val, update) => {
  if (val === '') {
    update(() => {
      zipcodeOptions.value = zip2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    zipcodeOptions.value = zip2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterPrevCourse = (val, update, abort) => {
  if (val === '') {
    update(() => {
      prevCourseOptions.value = prevCourse2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    prevCourseOptions.value = prevCourse2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterPrevSchool = (val, update, abort) => {
  if (val === '') {
    update(() => {
      prevSchoolOptions.value = prevSchool2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    prevSchoolOptions.value = prevSchool2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterScProgram = (val, update, abort) => {
  if (val === '') {
    update(() => {
      ScProgramOptions.value = ScProgram2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    ScProgramOptions.value = ScProgram2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterCouncil = (val, update, abort) => {
  if (val === '') {
    update(() => {
      councilOptions.value = council2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    councilOptions.value = council2.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) || option.value.toLowerCase().includes(needle),
    )
  })
}

const filterGradschool = (val, update) => {
  if (val === '') {
    update(() => {
      gradschoolOptions.value = gradschool2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    gradschoolOptions.value = gradschool2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterGradcourse = (val, update) => {
  if (val === '') {
    update(() => {
      gradcourseOptions.value = gradcourse2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    gradcourseOptions.value = gradcourse2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterScholarshipProgram = (val, update) => {
  if (val === '') {
    update(() => {
      scholarshipProgramOptions.value = scholarshipProgram2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    scholarshipProgramOptions.value = scholarshipProgram2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterEntryType = (val, update) => {
  if (val === '') {
    update(() => {
      entryTypeOptions.value = entryType2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    entryTypeOptions.value = entryType2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterGrant = (val, update) => {
  if (val === '') {
    update(() => {
      grantOptions.value = grant2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    grantOptions.value = grant2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterLevel = (val, update) => {
  if (val === '') {
    update(() => {
      levelOptions.value = level2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    levelOptions.value = level2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterAvailment = (val, update) => {
  if (val === '') {
    update(() => {
      availmentOptions.value = availment2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    availmentOptions.value = availment2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const filterScholarType = (val, update) => {
  if (val === '') {
    update(() => {
      scholartypeOptions.value = scholartype2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    scholartypeOptions.value = scholartype2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const scholarid = ref(null)
// Other Functions

const handleRowClick = async (evt, row) => {
  isEditing.value = true
  state.spasid = row.spas_id
  status.value = row.school_grad_status
  substatus.value = row.sub_status
  state.firstname = row.fname
  state.middlename = row.mname
  state.lastname = row.lname
  state.suffixname = row.suffix
  state.birth = row.birthday
  sex.value = row.sex
  state.email = row.email
  state.alemail = row.alternate_email
  state.contact = row.contact

  scholarid.value = row.id

  const formData = new FormData()
  formData.append('scholarid', scholarid.value)

  try {
    const [resAddress, resSchools, resGradSchools, resThesis, resDateSem] = await Promise.all([
      axios.post('/scholars_function.php?readAddressId', formData),
      axios.post('/scholars_function.php?readSchoolsId', formData),
      axios.post('/scholars_function.php?readGradSchoolsId', formData),
      axios.post('/scholars_function.php?readThesisId', formData),
      axios.post('/scholars_function.php?readDateSemId', formData),
    ])

    // Address data
    const addr = resAddress.data
    zipcode.value = addr.zipcode
    state.blocklot = addr.house_number
    state.street = addr.street
    state.subdivision = addr.subdivision
    state.barangay = addr.barangay
    state.district = addr.district
    state.region = addr.h_region
    state.municipality = addr.town
    state.province = addr.province

    // Schools data
    const schools = resSchools.data
    prevCourse.value = schools.current_course
    prevschool.value = schools.current_school
    scprog.value = schools.scholarship_program
    state.units = schools.units
    state.batch = schools.batch
    entryType.value = schools.entry_level
    spas_academic_year.value = schools.year

    // Graduate schools data
    const gradSchools = resGradSchools.data
    council.value = gradSchools.council
    gradschool.value = gradSchools.grad_school
    gradcourse.value = gradSchools.grad_course
    state.schoolregion = gradSchools.region
    state.comp = gradSchools.comp
    grant.value = gradSchools.grant_test
    scholarshipProgram.value = gradSchools.grad_program
    state.academicyear = gradSchools.award_year
    level.value = gradSchools.level
    availment.value = gradSchools.availment
    state.semester = gradSchools.sem

    // Thesis data
    const thesis = resThesis.data
    state.research = thesis.title
    scholartype.value = thesis.school_type
    state.graduationdate = thesis.grad_date
    state.honorsawards = thesis.honors
    state.dissemination = thesis.dissemination
    state.researchgrant = thesis.research
    state.serviceobligation = thesis.servob
    state.remarks = thesis.remarks
    state.duration = thesis.duration
    state.fields = thesis.field

    // Date/Sem data
    const dateSem = resDateSem.data
    state.foreignsemone = dateSem.foreign_sem
    state.foreignstartdate = dateSem.foreign_startdate
    state.foreignsemtwo = dateSem.foreign_endsem
    state.foreignenddate = dateSem.foreign_enddate
    state.localsemone = dateSem.local_sem
    state.localstartdate = dateSem.local_startdate
    state.localsemtwo = dateSem.local_endsem
    state.localenddate = dateSem.local_enddate
  } catch (error) {
    console.error('Failed to load scholar data on row click:', error)
    notifyError('Failed to load scholar details')
  }
}

const submitScholar = async () => {
  const validations = await Promise.all([
    reffirstname.value.validate(),
    reflastname.value.validate(),
    refbirth.value.validate(),
    refsex.value.validate(),
    refemail.value.validate(),
    refalemail.value.validate(),
    refcontact.value.validate(),
    refzipcode.value.validate(),
    refblocklot.value.validate(),
    refstreet.value.validate(),
    refPrevCourse.value.validate(),
    refPrevSchool.value.validate(),
    refScProg.value.validate(),
    refunits.value.validate(),
    refcouncil.value.validate(),
    refgradschool.value.validate(),
    refgradcourse.value.validate(),
    refduration.value.validate(),
    refScholarshipProgram.value.validate(),
    refEntryType.value.validate(),
    refacademicyear.value.validate(),
    refbatch.value.validate(),
    refgrant.value.validate(),
    reflevel.value.validate(),
    refavailment.value.validate(),
    refserviceobligation.value.validate(),
    refscholartype.value.validate(),
    refremarks.value.validate(),
  ])

  if (validations.includes(false)) {
    notifyError('Please fill all required fields')
    return
  }

  const formData = new FormData(document.getElementById('submitScholarForm'))

  formData.append('sex', sex.value)
  formData.append('prevschool', prevschool.value)
  formData.append('prevCourse', prevCourse.value)
  formData.append('scprog', scprog.value)
  formData.append('council', council.value)
  formData.append('scholarshipProgram', scholarshipProgram.value)
  formData.append('grant', grant.value)
  formData.append('level', level.value)
  formData.append('availment', availment.value)
  formData.append('scholartype', scholartype.value)
  formData.append('entryType', entryType.value)
  formData.append('gradschool', gradschool.value)
  formData.append('gradcourse', gradcourse.value)
  formData.append('yearawarded', spas_academic_year.value)
  formData.append('usercreator', user.username)
  formData.append('scholarid', scholarid.value)
  formData.append('status', status.value)
  formData.append('substatus', substatus.value)
  formData.append('usercreator', user.username)

  try {
    if (isEditing.value) {
      const [isStatusValid, isSubStatusValid] = await Promise.all([
        refStatus.value.validate(),
        refSubStatus.value.validate(),
      ])

      if (!isStatusValid || !isSubStatusValid) {
        notifyError('Please fill all required fields')
        return
      }

      const results = await Promise.all([
        axios.post('/scholars_function.php?updateScholarinfo', formData),
        axios.post('/scholars_function.php?updatescholarAddress', formData),
        axios.post('/scholars_function.php?updatescholarPrev', formData),
        axios.post('/scholars_function.php?updateGradScholarschool', formData),
        axios.post('/scholars_function.php?updateDateSem', formData),
        axios.post('/scholars_function.php?updateGradThesis', formData),
      ])

      const messages = [
        'Scholar Profile Information Updated Successfully',
        'Scholar Address Updated Successfully',
        'Scholar Previous School Updated Successfully',
        'Scholar Graduate School Updated Successfully',
        'Scholar Sem/Date Updated Successfully',
        'Scholar Thesis Updated Successfully',
      ]

      results.forEach((res, index) => {
        if (res.data === true) {
          notifySuccess(messages[index])
        } else {
          notifyError('Failed to Update')
        }
      })

      readScholars()
    } else {
      formData.append('action_type_create', isNew.value)

      axios
        .post('/scholars_function.php?createScholar', formData)
        .then(function (response) {
          if (response.data === true) {
            readScholars()
            notifySuccess('Scholar Created Successfully')

            // Log request without try/catch
            axios
              .post('/logs_function.php?scholarLogs', formData)
              .then(function (logResponse) {
                if (logResponse.data !== true) {
                  notifyError('Scholar Logs Creation Failed')
                }
              })
              .catch(function (logError) {
                console.error('Log Request Error:', logError)
                notifyError('An unexpected error occurred during logging')
              })
          } else {
            notifyError('Error Submitting Form')
          }
        })
        .catch(function (error) {
          console.error('Request Error:', error)
          notifyError('An unexpected error occurred')
        })
    }
  } catch (error) {
    console.error(error)
    notifyError('Something went wrong while submitting the form')
  }
}

// Batch Upload Codes

const bulkUploads = () => {
  rfBulkUpload.value.validate()

  if (rfBulkUpload.value.hasError) {
    notifyError('Something went wrong')
  } else {
    var formData = new FormData(document.getElementById('bulkUploadForm'))

    formData.append('usercreator', user.username)
    formData.append('authid', user.id)
    formData.append('action_type_create', isNew.value)

    axios.post('/scholars_function.php?bulkUpload', formData).then(function (response) {
      if (response.data == true) {
        axios.post('/logs_function.php?batchLogs', formData).then(function (logResponse) {
          if (logResponse.data !== true) {
            notifyError('Scholar Logs Creation Failed')
          }
        })

        docxUpload.value = false
        notifySuccess('Batch Upload of Scholars has been uploaded Successfully')
      } else {
        notifyError('Something went wrong')
      }
    })
  }
}

// Add Document Codes

const scholar_doc_id = ref()
const doc_description = ref()
const currentRow = ref(null)

const handleFiles = (props) => {
  Docx.value = true
  currentRow.value = props.row
  var formData = new FormData()
  scholar_doc_id.value = props.row.id

  formData.append('spasid', scholar_doc_id.value)

  axios.post('/scholars_function.php?docuId', formData).then(function (response) {
    rows.value = Array.isArray(response.data) ? response.data : []
  })

  axios.get('/scholars_function.php?populatefiles').then(function (response) {
    filetypes2 = response.data
  })
}

var filetypes2 = []
const filetypesOptions = ref(filetypes2)

const filterFilesTypes = (val, update) => {
  if (val === '') {
    update(() => {
      filetypesOptions.value = filetypes2
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filetypesOptions.value = filetypes2.filter((option) => {
      return option.label.toLowerCase().includes(needle)
    })
  })
}

const getDescription = () => {
  var formData = new FormData()
  formData.append('filetype_id', filetypes.value)

  axios.post('/scholars_function.php?fileTypePopulate', formData).then(function (response) {
    doc_description.value = response.data.name
    console.log(doc_description.value)
  })
}

const showFiles = (props) => {
  const url = `http://localhost/backdbases/upload/${props.row.file_name}`
  window.open(url, '_blank')
}

const addDocu = () => {
  reffile.value.validate()
  refFileTypes.value.validate()

  if (refFileTypes.value.hasError || reffile.value.hasError) {
    notifyError('Please Complete all the required fields')
  } else {
    var formData = new FormData(document.getElementById('editDocuForm'))
    formData.append('filetypes', filetypes.value)
    formData.append('files', files.value)
    formData.append('scholar_doc_id', scholar_doc_id.value)
    formData.append('doc_description', doc_description.value)
    axios.post('/scholars_function.php?uploadDocx', formData).then(function (response) {
      if (response.data == true) {
        handleFiles({ row: currentRow.value })
        notifySuccess('File Added Successfully')
      } else {
        alert('Error')
      }
    })
  }
}

const newScholar = () => {
  location.reload()
}

const generatePDF = () => {
  const doc = new jsPDF()

  const logoUrl = new URL('../assets/seilogopng.png', import.meta.url).href // Replace with your image URL
  const bpUrl = new URL('../assets/pilipinas.png', import.meta.url).href // Replace with your image URL
  const tuvUrl = new URL('../assets/tuv.png', import.meta.url).href // Replace with your image URL

  const imageCompression = 0.7

  // Get Date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Add the image from the URL to the PDF
  doc.addImage(logoUrl, 'PNG', 10, 5, 20, 20, null, 'FAST', imageCompression)

  // Set a title for the PDF

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Republic of the Philippines', 32, 11)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('DEPARTMENT OF SCIENCE AND TECHNOLOGY', 32, 17)

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('SCIENCE EDUCATION INSTITUTE', 32, 23)

  // Add the image from the URL to the PDF
  doc.addImage(bpUrl, 'PNG', 150, 5, 20, 20, null, 'FAST', imageCompression)
  doc.addImage(tuvUrl, 'PNG', 170, 5, 33, 20, null, 'FAST', imageCompression)

  doc.setLineWidth(0.5)
  doc.line(10, 27, 203, 27) // x1, y1, x2, y2

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('Service. Excellence. Innovation.', 10, 30)

  doc.setFont('helvetica', 'normal') // Set font and style
  doc.setFontSize(10) // Set font size
  doc.text(`${formattedDate}`, 180, 32) // Add the date to position (10, 10)

  doc.setFontSize(15)
  doc.setFont('helvetica', 'italic')
  doc.text('Scholarship Informations', 77, 35)

  const inputX = 10
  const inputY = 35
  const inputWidth = 42
  const inputHeight = 7

  // Draw a rectangle (input box)
  doc.rect(inputX, inputY, inputWidth, inputHeight)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(state.spasid, inputX + 2, inputY + 5) // Adjusted to fit inside the box

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Status: ${status.value} - ${substatus.value}`, 160, 38)
  doc.text(
    `Full Name: ${state.lastname} , ${state.firstname} ${state.middlename} ${state.suffixname}`,
    10,
    48,
  )
  doc.text(`Birthday: ${state.birth}`, 10, 51)

  // Save or preview the PDF
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

onMounted(() => {
  readScholars()
  populateAddress()
  populateschool()
  populateCourseField()
  getCurrentYear()
})
</script>
